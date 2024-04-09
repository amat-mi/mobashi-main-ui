import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import _ from 'lodash';
import { Observable, combineLatest, map } from 'rxjs';
import { APP_CONFIG, AppConfig } from 'src/app/app.config';
import { AuthService } from 'src/app/contrib/auth/auth.service';
import { FeathersService } from 'src/app/contrib/feathers/feathers.service';
import { SchoolService } from '../school/school.service';
import { CampaignService } from '../campaign/campaign.service';

@Injectable({
  providedIn: 'root'
})
export class CaschoService {
  private restService

  //do NOT let empty values be emitted
  public readonly objects$ = this.api.selectResult('caschos', { excludeEmpty: true });
  public readonly perms$ = this.authApi.userdata$.pipe(
    map((userdata) => userdata?.perms.cascho)
  );
  public readonly campaigns$ = this.campaignService.objects$
  public readonly schools$ = this.schoolService.schools$;

  constructor(
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private api: FeathersService,
    private authApi: AuthService,
    private router: Router,
    private campaignService: CampaignService,
    private schoolService: SchoolService
  ) {
    this.restService = this.api.createRestService('/caschos',
      this.appConfig['HOST'], 'main/caschos/');
    this.api.attachLoadingLoader('caschos');        //present Loader while loading
    this.api.attachErrorToast('caschos', { duration: 0 });           //present Toast if error (with no autoclosing)
  }

  /**
   * If requested data is already inside the store, return it, otherwise ask server for list of objects
   * 
   * @returns A Promise that will resolve with the data
   */
  public async ensure() {
    this.campaignService.ensure();
    this.schoolService.ensure();

    const data = this.api.getResult('caschos');
    return data?.length != undefined ?
      Promise.resolve(data) :
      this.restService.find()
        .then((data: { value: any; }) => data.value);     //MUST use value here!!!
  }

  /**
   * Get the object with the specified id.
   * If no id specified, return an empty object.
   * 
   * @param paramMap Use ActivatedRoute.paramMap for this
   * @param name Name of param to get the object id from
   * @returns An Observable that emits the object having the id specified in paramMap
   */
  public objectByID(paramMap: Observable<ParamMap>, name: string) {
    return combineLatest([paramMap, this.objects$]).pipe(
      map(([params, objects]) => {
        const id = Number(params.get(name) ?? '0');

        return !!id ? _.find(objects, ['id', id]) :
          {
            campaign: null,
            school: null,
            perms: {
              "add": true,
              "change": true,
              "delete": true,
              "view": true
            }
          }
      })
    );
  }

  public byCampaign(campaign: any) {
    return this.objects$.pipe(
      map((objects) => _.filter(objects, (object) => object.campaign == campaign.id) ?? [])
    );
  }

  public schoolsNotInCampaign(campaign: any) {
    return combineLatest([this.schools$, this.byCampaign(campaign)]).pipe(
      map(([schools, objects]) => {
        const res = !!objects ?
          _.differenceWith(schools as any[], objects, (school, object) => school.id == object.school) :
          schools;

        return res;
      })
    );
  }

  public delete(object: any, route?: ActivatedRoute) {
    //only if specified object does have an id
    if (!!object.id) {
      this.restService.remove(object.id)
        .then((data: any) => {
          console.debug(data?.value);

          this.restService.reset();                   //MUST clear last data from the redux Store!!!
          this.ensure();                              //and reload it from server

          if (!!route)
            this.router.navigate(['..'], { relativeTo: route });    //navigate to list of objects
        });
    }
  }

  public save(object: any, route?: ActivatedRoute) {
    //if specified object does not have an id, it's a creation, otherwise an editing
    const promise = !!object.id ?
      this.restService.patch(object.id, object) :
      this.restService.create(object);

    return promise
      .then((data: any) => {
        console.debug(data?.value);

        this.restService.reset();                   //MUST clear last data from the redux Store!!!
        this.ensure();                              //and reload it from server

        //if specified object does not have an id, assign to it the one returned from server
        //and redirect to its own detail page
        if (!object.id) {
          object.id = data?.value.id;         //MUST use value here!!!

          if (!!route)
            this.router.navigate(['..', object.id], { relativeTo: route });
        }

        return data?.value;
      });
  }
}

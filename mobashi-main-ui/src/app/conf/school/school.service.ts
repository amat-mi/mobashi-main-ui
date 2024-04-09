import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import _ from 'lodash';
import { Observable, combineLatest, map } from 'rxjs';
import { APP_CONFIG, AppConfig } from '../../app.config';
import { FeathersService } from '../../contrib/feathers/feathers.service';
import { CampaignService } from '../campaign/campaign.service';
import { AuthService } from 'src/app/contrib/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private schoolRestService;

  //do NOT let empty values be emitted
  public readonly schools$ = this.api.selectResult('schools', { excludeEmpty: true })
  public readonly perms$ = this.authApi.userdata$.pipe(
    map((userdata) => userdata?.perms.school)
  );

  constructor(
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private api: FeathersService,
    private authApi: AuthService,
    private router: Router,
    private campaignService: CampaignService
  ) {
    this.schoolRestService = this.api.createRestService('/schools',
      this.appConfig['HOST'], 'main/schools/');
    this.api.attachLoadingLoader('schools');        //present Loader while loading
    this.api.attachErrorToast('schools', { duration: 0 });           //present Toast if error (with no autoclosing)
  }

  /**
   * If requested data is already inside the store, return it, otherwise ask server for list of Schools
   * 
   * @returns A Promise that will resolve with the data
   */
  public async ensure(refresh = false) {
    //if requested data is already inside the store, return it,
    //otherwise ask server for list of Campaigns
    const data = this.api.getResult('schools');
    return !refresh && data?.length != undefined ?
      Promise.resolve(data) :
      this.schoolRestService.find()
        .then((data: { value: any; }) => data.value);     //MUST use value here!!!
  }

  /**
   * Get the School with the specified id.
   * If no id specified, return an empty School.
   * 
   * @param paramMap Use ActivatedRoute.paramMap for this
   * @param name Name of param to get the School id from
   * @returns An Observable that emits the School having the id specified in paramMap
   */
  public schoolByID(paramMap: Observable<ParamMap>, name: string) {
    return combineLatest([paramMap, this.schools$]).pipe(
      map(([params, schools]) => {
        const id = Number(params.get(name) ?? '0');

        return !!id ? _.find(schools, ['id', id]) :
          {
            name: null,
            code: null,
            students: null,
            address: null,
            lat: null,
            lng: null,
            perms: {
              "add": true,
              "change": true,
              "delete": true,
              "view": true
            }
          };
      })
    );
  }

  /**
   * Get all the Schools present inside the Campaign with the specified UUID.
   * 
   * @param paramMap Use ActivatedRoute.paramMap for this
   * @param name Name of param to get the Campaign UUID from
   * @returns An Observable that emits an Array of all the Schools associated with the requested Campaign
   */
  public schoolsByCampaignUUID(paramMap: Observable<ParamMap>, name: string) {
    return combineLatest([paramMap, this.schools$, this.campaignService.campaignByUUID(paramMap, name)]).pipe(
      map(([params, schools, campaign]) => _.filter(schools, (school) => _.includes(campaign.schools, school.id)))
    );
  }

  public delete(object: any, route: ActivatedRoute) {
    //only if specified object does have an id
    if (!!object.id) {
      this.schoolRestService.remove(object.id)
        .then((data: any) => {
          console.debug(data?.value);

          this.schoolRestService.reset();                         //MUST clear last data from the redux Store!!!
          this.router.navigate(['..'], { relativeTo: route });    //navigate to School list
        });
    }
  }

  public save(object: any, route: ActivatedRoute) {
    //if specified object does not have an id, it's a creation, otherwise an editing
    const promise = !!object.id ?
      this.schoolRestService.patch(object.id, object) :
      this.schoolRestService.create(object);

    return promise
      .then((data: any) => {
        console.debug(data?.value);

        this.schoolRestService.reset();                   //MUST clear last data from the redux Store!!!

        //if specified object does not have an id, assign to it the one returned from server
        //and redirect to its own detail page
        if (!object.id) {
          object.id = data?.value.id;         //MUST use value here!!!

          this.router.navigate(['..', object.id], { relativeTo: route });
        }

        return data?.value;
      });
  }

  public resetPassword(school: any, user: number, email: string) {
    throw new Error('Method not implemented.');
  }
}

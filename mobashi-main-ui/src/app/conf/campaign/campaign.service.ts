import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, combineLatest, map } from 'rxjs';
import { APP_CONFIG, AppConfig } from '../../app.config';
import { FeathersService } from '../../contrib/feathers/feathers.service';

import _ from 'lodash';
import { AuthService } from 'src/app/contrib/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private restService

  //do NOT let empty values be emitted
  public readonly objects$ = this.api.selectResult('campaigns', { excludeEmpty: true });
  public readonly perms$ = this.authApi.userdata$.pipe(
    map((userdata) => userdata?.perms.campaign)
  );

  constructor(
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private api: FeathersService,
    private authApi: AuthService,
    private router: Router,
  ) {
    this.restService = this.api.createRestService('/campaigns',
      this.appConfig['HOST'], 'main/campaigns/');
    this.api.attachLoadingLoader('campaigns');        //present Loader while loading
    this.api.attachErrorToast('campaigns', { duration: 0 });           //present Toast if error (with no autoclosing)
  }

  /**
   * If requested data is already inside the store, return it, otherwise ask server for list of Campaigns
   * 
   * @returns A Promise that will resolve with the data
   */
  public async ensure() {
    const data = this.api.getResult('campaigns');
    return data?.length != undefined ?
      Promise.resolve(data) :
      this.restService.find()
        .then((data: { value: any; }) => data.value);     //MUST use value here!!!
  }

  /**
   * Get the Campaign with the specified id.
   * If no id specified, return an empty Campaign.
   * 
   * @param paramMap Use ActivatedRoute.paramMap for this
   * @param name Name of param to get the Campaign id from
   * @returns An Observable that emits the Campaign having the id specified in paramMap
   */
  public campaignByID(paramMap: Observable<ParamMap>, name: string) {
    return combineLatest([paramMap, this.objects$]).pipe(
      map(([params, objects]) => {
        const id = Number(params.get(name) ?? '0');

        return !!id ? _.find(objects, ['id', id]) :
          {
            name: null,
            stamp_start: null,
            stamp_end: null,
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

  /**
   * Get the Campaign with the specified UUID.
   * 
   * @param paramMap Use ActivatedRoute.paramMap for this
   * @param name Name of param to get the Campaign UUID from
   * @returns An Observable that emits the Campaign having the UUID specified in paramMap
   */
  public campaignByUUID(paramMap: Observable<ParamMap>, name: string) {
    return combineLatest([paramMap, this.objects$]).pipe(
      map(([params, campaigns]) => _.find(campaigns, ['uuid', params.get(name)]))
    );
  }

  public delete(object: any, route: ActivatedRoute) {
    //only if specified object does have an id
    if (!!object.id) {
      this.restService.remove(object.id)
        .then((data: any) => {
          console.debug(data?.value);

          this.restService.reset();                               //MUST clear last data from the redux Store!!!
          this.router.navigate(['..'], { relativeTo: route });    //navigate to list of objects
        });
    }
  }

  public save(object: any, route: ActivatedRoute) {
    //if specified object does not have an id, it's a creation, otherwise an editing
    const promise = !!object.id ?
      this.restService.patch(object.id, object) :
      this.restService.create(object);

    return promise
      .then((data: any) => {
        console.debug(data?.value);

        this.restService.reset();                   //MUST clear last data from the redux Store!!!

        //if specified object does not have an id, assign to it the one returned from server
        //and redirect to its own detail page
        if (!object.id) {
          object.id = data?.value.id;         //MUST use value here!!!

          this.router.navigate(['..', object.id], { relativeTo: route });
        }

        return data?.value;
      });
  }
}


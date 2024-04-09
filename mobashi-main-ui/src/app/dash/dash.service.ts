import { Inject, Injectable } from '@angular/core';
import { FeathersService } from '../contrib/feathers/feathers.service';
import { ParamMap } from '@angular/router';
import { Observable, combineLatest, map, of, switchMap } from 'rxjs';
import { APP_CONFIG, AppConfig } from '../app.config';

import _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class DashService {
  private dashRestService
  private dashheatRestService
  private dashlinkRestService
  private lastUUID: string | null = null;

  //do NOT let empty values be emitted
  public readonly dashes$ = this.api.selectResult('dashes', { excludeEmpty: true }).pipe(
    map((dashes) =>
      _.map(dashes, (dash) => {
        const schools = (dash?.schools ?? []);

        _.forEach(schools, (school) => {
          school['surveys'] = school['received'][0] + school['received'][1];
          school['expects'] = school['expected'][0] + school['expected'][1];
        });

        return {
          ...dash,
          count: schools.length,
          expected: [
            _.sumBy(schools, 'expected[0]'),
            _.sumBy(schools, 'expected[1]'),
          ],
          received: [
            _.sumBy(schools, 'received[0]'),
            _.sumBy(schools, 'received[1]'),
          ],
          surveys: _.sumBy(schools, 'surveys'),
          expects: _.sumBy(schools, 'expects'),
          students: _.sumBy(dash?.schools ?? [], 'students'),
        };
      })
    )
  );

  constructor(
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private api: FeathersService,
  ) {
    this.dashRestService = this.api.createRestService('/dashes',
      this.appConfig['HOST'], 'main/dashes/');
    this.api.attachLoadingLoader('dashes');        //present Loader while loading
    this.api.attachErrorToast('dashes', { duration: 0 });           //present Toast if error (with no autoclosing)

    this.dashheatRestService = this.api.createRestService('/dashheats',
      this.appConfig['HOST'], 'main/dashheats/');
    this.api.attachLoadingLoader('dashheats');        //present Loader while loading
    this.api.attachErrorToast('dashheats', { duration: 0 });           //present Toast if error (with no autoclosing)

    this.dashlinkRestService = this.api.createRestService('/dashlinks',
      this.appConfig['HOST'], 'main/dashlinks/');
    this.api.attachLoadingLoader('dashlinks');        //present Loader while loading
    this.api.attachErrorToast('dashlinks', { duration: 0 });           //present Toast if error (with no autoclosing)
  }

  /**
   * If requested data is already inside the store, return it, otherwise ask server for list of Dashes
   * 
   * @returns A Promise that will resolve with the data
   */
  public async ensure() {
    const data = this.api.getResult('dashes');
    return data?.length != undefined ?
      Promise.resolve(data) :
      this.dashRestService.find()
        .then((data: { value: any; }) => data.value);     //MUST use value here!!!
  }

  /**
   * Get the Dash for the Campaign with the specified UUID.
   * 
   * @param paramMap Use ActivatedRoute.paramMap for this
   * @param name Name of param to get the Campaign UUID from
   * @returns An Observable that emits the Dash for the Campaign having the UUID specified in paramMap
   */
  public dashByCampaignUUID(paramMap: Observable<ParamMap>, name: string) {
    return combineLatest([paramMap, this.dashes$]).pipe(
      map(([params, dashes]) => _.find(dashes, ['uuid', params.get(name)]))
    );
  }

  /**
   * Get the Dashheat data for the Campaign with the specified UUID.
   * 
   * @param paramMap Use ActivatedRoute.paramMap for this
   * @param name Name of param to get the Campaign UUID from
   * @returns An Observable that emits the Dahsheats array for the Campaign having the UUID specified in paramMap
   */
  public dashheatByCampaignUUID(paramMap: Observable<ParamMap>, name: string): Observable<any[]> {
    return paramMap.pipe(
      switchMap((params, index) => {
        const campaign_uuid = params.get(name);
        let restNeeded = true;                              //must call server, by default
        if (campaign_uuid == this.lastUUID) {               //if same Campaign of previous invocation
          const data = this.api.getResult('dashheats');       //get data directly from the redux Store
          if (data?.length != undefined)                      //if data actually present
            restNeeded = false;                                 //no need to get it from server
        }

        if (restNeeded) {                                    //only if actually needed
          this.lastUUID = null;                               //clear last requested UUID
          this.dashheatRestService.reset();                   //clear last data from the redux Store
          this.dashheatRestService.find({                     //get data from server
            query: { campaign_uuid }
          }).then((data: { value: any; }) => {
            this.lastUUID = campaign_uuid;        //store last requested UUID

            return data.value;                    //MUST use value here!!!
          });
        }

        //always return Observable from the redux Store, adding calculated field "mode" as a join of "modes" array's items
        //do NOT let empty values be emitted
        return this.api.selectResult('dashheats', { excludeEmpty: true }).pipe(
          map((dashheats) =>
            _.map(dashheats, (dashheat) => {
              return {
                ...dashheat,
                mode: (dashheat.modes ?? []).join()
              };
            }))
        );
      })
    );
  }

  /**
   * Get the Dashlink data for the Campaign with the specified UUID.
   * 
   * @param paramMap Use ActivatedRoute.paramMap for this
   * @param name Name of param to get the Campaign UUID from
   * @returns An Observable that emits the Dahslinks array for the Campaign having the UUID specified in paramMap
   */
  public dashlinkByCampaignUUID(paramMap: Observable<ParamMap>, name: string): Observable<any[]> {
    return paramMap.pipe(
      switchMap((params, index) => {
        const campaign_uuid = params.get(name);
        let restNeeded = true;                              //must call server, by default
        if (campaign_uuid == this.lastUUID) {               //if same Campaign of previous invocation
          const data = this.api.getResult('dashlinks');       //get data directly from the redux Store
          if (data?.length != undefined)                      //if data actually present
            restNeeded = false;                                 //no need to get it from server
        }

        if (restNeeded) {                                    //only if actually needed
          this.lastUUID = null;                               //clear last requested UUID
          this.dashlinkRestService.reset();                   //clear last data from the redux Store
          this.dashlinkRestService.find({                     //get data from server
            query: { campaign_uuid }
          }).then((data: { value: any; }) => {
            this.lastUUID = campaign_uuid;        //store last requested UUID

            return data.value;                    //MUST use value here!!!
          });
        }

        //do NOT let empty values be emitted
        return this.api.selectResult('dashlinks', { excludeEmpty: true });      //always return Observable from the redux Store
      })
    );
  }
}


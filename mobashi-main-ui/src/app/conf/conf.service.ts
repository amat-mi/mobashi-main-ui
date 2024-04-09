import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfService {
  private readonly menuData$$ = new BehaviorSubject<Observable<any>>(of({}));
  public menuData$ = this.menuData$$.asObservable();

  constructor() { }

  public setMenuData(routeData$: Observable<any>) {
    this.menuData$$.next(routeData$);
  }

  public setMenuDataComplex(routeData$: Observable<any>, others$: Observable<any>, basePath: string, options: any = {}) {
    options = Object.assign({
      idName: 'id',
      keyName: undefined,
      labelName: undefined
    }, options || {});

    if (!options.labelName && !options.keyName)
      options.keyName = 'name';

    if (!!options.labelName && !!options.keyName)
      options.keyName = undefined;

    this.setMenuData(
      combineLatest([routeData$, others$]).pipe(
        map(([data, others]) => {
          return {
            links: [
              ...data?.['links'],
              ...others.map((x: any) => ({
                path: `${basePath}/${x.id}`,
                key: options.keyName ? x[options.keyName] : undefined,
                label: options.labelName ? x[options.labelName] : undefined,
              }))
            ]
          };
        })
      )
    );
  }
}

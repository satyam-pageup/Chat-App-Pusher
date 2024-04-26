import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { APIRoutes } from "../constants/apiRoutes.constant";
import { HeaderOption } from "../../model/headerOption.model";
import { environment } from "../../../environments/environment";

export class ComponentBase {

    public baseUrl: string = environment.baseUrl;
    public isBtnLoaderActive: boolean = false;

    public headerOption: HeaderOption = {
        isSilentCall: false,
        isSendNotification: false
    }

    public myHeader!: HttpHeaders;

    // SERVICE
    public _router: Router = inject(Router);
    public _toastreService: ToastrService = inject(ToastrService);
    public _httpClient: HttpClient = inject(HttpClient);



    public getAPICallPromise<R>(url: string, hOption: HeaderOption): Promise<R> {

        let myNewHeader: HttpHeaders = new HttpHeaders({
            isSendNotification: 'true',
            isSilentCall: (hOption.isSilentCall)? 'true': 'false'
        })

        const hitUrl: string = `${this.baseUrl}${url}`;
        const getPromise = new Promise<R>((resolve, reject) => {
            this._httpClient.get<R>(hitUrl, { headers: myNewHeader}).subscribe({
                next: (res) => {
                    resolve(res);
                    this.isBtnLoaderActive = false;
                },

                error: (err) => {
                    this.isBtnLoaderActive = false;
                    console.log(err);
                    this._toastreService.error(err);
                    reject(err);
                }
            })
        });

        return getPromise;
    }

    public postAPICallPromise<D, R>(url: string, data: D, hOption: HeaderOption): Promise<R> {

        let myNewHeader: HttpHeaders = new HttpHeaders({
            isSendNotification: 'true',
            isSilentCall: 'true'
        })

        let hitUrl: string = `${this.baseUrl}${url}`;

        const postPromise = new Promise<R>((resolve, reject) => {
            this._httpClient.post<R>(hitUrl, data, {headers: myNewHeader}).subscribe({
                next: (res) => {
                    resolve(res);
                    this.isBtnLoaderActive = false;
                },

                error: (err) => {
                    this.isBtnLoaderActive = false;
                    console.log(err);
                    reject(err);
                }
            })
        });

        return postPromise;
    }

    public putAPICallPromise<D, R>(url: string, data: D, hOption: HeaderOption): Promise<R> {
        const hitUrl: string = `${this.baseUrl}${url}`;
        const postPromise = new Promise<R>((resolve, reject) => {
            this._httpClient.put<R>(hitUrl, data).subscribe({
                next: (res) => {
                    resolve(res);
                    this.isBtnLoaderActive = false;
                },

                error: (err) => {
                    this.isBtnLoaderActive = false;
                    console.log(err);
                    reject(err);
                }
            })
        });

        return postPromise;
    }

    public deleteAPICallPromise<D, R>(url: string, data: D, hOption: HeaderOption): Promise<R> {
        const hitUrl: string = `${this.baseUrl}${url}`;
        const postPromise = new Promise<R>((resolve, reject) => {
            this._httpClient.delete<R>(hitUrl, { body: data }).subscribe({
                next: (res) => {
                    resolve(res);
                    this.isBtnLoaderActive = false;
                },

                error: (err) => {
                    this.isBtnLoaderActive = false;
                    console.log(err);
                    reject(err);
                }
            })
        });

        return postPromise;
    }
}
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gifs } from '../interfaces/gifs.interface';
import {
  Injectable
} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private url : string ="https://api.giphy.com/v1/gifs"
  private apiKey: string = '';
  private _historial: string[] = [];
  public resultados: Gifs[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor(private http:HttpClient){
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  buscarGifs(query: string) {
    query = query.trim().toLocaleLowerCase();
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.slice(0, 10);
      localStorage.setItem('historial', JSON.stringify(this.historial));;
    }
    const params = new HttpParams()
                  .set('api_key',this.apiKey)
                  .set('limit',10)
                  .set('lang','es')
                  .set('q',query);
    this.http.get<SearchGifsResponse>(`${this.url}/search`, {params})
    .subscribe((resp) => {
      console.log(resp.data);
      this.resultados = resp.data;
      localStorage.setItem('resultados', JSON.stringify(this.resultados));
    });
  }
}

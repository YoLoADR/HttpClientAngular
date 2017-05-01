import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';

// Comme la bibliothèque RxJS est grande, il est important d'importer uniquement les fonctionnalités nécessaires pour d'optimiser la construction d'une application, surtout sur les appareils mobiles. La méthode getData() nécessite les opérateurs .map() et .catch().
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {Personnage} from './personnage';

@Injectable()
export class PersonnageService {
    private personnagesUrl = 'api/personnages'; // URL de l'API web

    // Notez que le service client Angular Http est injecté dans le constructeur HeroService.
    constructor (private http:Http){}

        // (?) map(this.extractData) = map est une methode d'Observable qui récupère des flux (petit à petit) comme pour les videos Youtube c'est pour cela qu'on map et extractData permet de Parser les data extraite au bon format

        getPersonnages(): Observable<Personnage[]>{
            return this.http
            // Vous passez l'URL de la ressource pour faire un appelle au serveur et récuperer les personnages 
            .get(this.personnagesUrl)
            // On s'attend à un .then() pour extraire les personnages mais au lieu de cela, on appel une méthode .map().
            // En fait, la méthode http.get renvoie un Observable de la bibliothèque RXJS et map () est l'une de ses méthodes.
            .map(this.extractData)
            // Pour moi handleError est très utile pour éviter les erreurs silencieuse et permet d'éviter à farfouiller dans le code à la recherche d'erreur
            .catch(this.handleError);
        }

        // Pour creer un personnage on demande juste le nom, car c'est généralement le serveur qui s'occupe de créer l'Id
        create(name:string): Observable<Personnage> {
            //Dans l'objet des en-têtes, le Content-Type spécifie que le corps représente JSON
            let headers = new Headers({'Content-Type': 'application/json'});
            // L'objet d'options est une nouvelle instance de RequestOptions, une classe qui vous permet de spécifier certains paramètres lors de l'instanciation d'une requête. les options sont le troisième argument paramètre de la méthode post (), comme indiqué ci-dessus.
            let options = new RequestOptions({headers: headers});
            // Comme pour getPersonnages(), on utilise l'assistant extractData() pour extraire les données de la réponse.
            return this.http.post(this.personnagesUrl, {name}, options).map(this.extractData).catch(this.handleError);
        }

        // Les réponses / données extraite (extractData) ne contiennent pas les données sous une forme que l'application peut utiliser directement. Vous devez analyser les données de réponse dans un objet JSON.
        private extractData(res: Response){
            //Les données de réponse sont en forme de chaîne JSON. L'application doit analyser cette chaîne dans des objets JavaScript en appelant response.json ().
            //Ne vous attendez pas à ce que le JSON décodé soit le groupe de personnages / data directement. Ce serveur enveloppe toujours les résultats JSON dans un objet avec une propriété de données. Vous devez le dérouler pour obtenir les personnages /data. Il s'agit d'un comportement classique de l'API Web, motivé par des problèmes de sécurité.
            let body = res.json();
            return body.data || {};
        }

        private handleError (error: Response | any) {
            // In a real world app, you might use a remote logging infrastructure
            let errMsg: string;
            if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            } else {
            errMsg = error.message ? error.message : error.toString();
            }
            console.error(errMsg);
            return Observable.throw(errMsg);
        }
    }

}
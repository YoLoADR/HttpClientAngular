import { Component, OnInit } from '@angular/core';
import {Personnage} from './personnage';
import {PersonnageService} from './personnage.service';

@Component({
  selector: 'app-personnage',
  templateUrl: './personnage.component.html',
  styleUrls: ['./personnage.component.css']
})
export class PersonnageComponent implements OnInit {

  messageErreur : string;

  //personnage: Personnage = doit avoir la forme d'un item
  personnages: Personnage[]; // = doit avoir la forme d'un liste de personnages
  //Se rappeller qu'un Observable est un flux d'événements publié par une source. Le bonne exemple est la vidéo en streaming
  mode ='Observable';

  //Les composants sont plus faciles à tester et à déboguer lorsque leurs constructeurs sont simples et que tout travail réel (en particulier appelant un serveur distant) est traité dans une méthode distincte.
  constructor(private personageService: PersonnageService) { }

  ngOnInit() {
    this.recuperePersonnages();
  }

  // On crée notre méthode getPersonnage internet à ce composant basé sur celle du service
  recuperePersonnages(){
    this.personageService.getPersonnages().subscribe(
      personnages => this.personnages = personnages,
      error => this.messageErreur = <any>error);
    );
  }

  ajoutPersonnage(name: string){
    if(!name){return;}

    this.personageService.create(name)
    .subscribe(
      // La méthode ajoutPersonnage() s'inscrit à l'Observable renvoyé par la méthode create() du service.
      // (!) Lorsque les données arrivent, il pousse le nouvel objet de héros dans son réseau de héros pour une présentation à l'utilisateur.
      personnage => this.personnages.push(personnage),
      error => this.messageErreur = <any>error
    );
  }
}

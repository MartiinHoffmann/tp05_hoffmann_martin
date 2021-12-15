import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilisateurService } from 'src/app/services/utilisateur.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private utilisateurService: UtilisateurService) {
    this.form = this.formBuilder.group({
      prenom: ['', Validators.required],
      motdepasse: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
  }

  connexion() {
    const formValues = this.form.value;
    if (formValues.prenom && formValues.motdepasse) {
      this.utilisateurService.Connexion(formValues.prenom, formValues.motdepasse).subscribe(()=> {
            console.log("Utilisateur connecté");
          }
        );
    }
  }
}
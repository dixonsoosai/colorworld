import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormulaBody, FormulaHeader } from 'src/app/demo/domain/formula';
import { errorToastr } from 'src/app/demo/service/apputils.service';
import { FormulaService } from 'src/app/demo/service/formula.service';
import * as $ from 'jquery';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.scss'],
  providers:[MessageService, ConfirmationService]
})
export class FormulaComponent{

  isLoading = false;
  formulaVisible = false;
  formulaList:FormulaHeader[] = [];

  codeHeader: FormulaHeader = new FormulaHeader();
  codeBody: FormulaBody[] = [];
  codeBodyml: FormulaBody[] = [];

  qty = 100;

  constructor(
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private formulaService: FormulaService) {

  }

  ngOnInit() {
    this.getCarShades();
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  clear(table: Table) {
    table.clear();
  }
  
  getCarShades() {
    this.spinner.show();
    this.formulaService.fetchAll().subscribe(
      { 
        next: response =>
        {
          if(response.code == 200) {
            this.formulaList = response.data;
          }
        } , 
        error: error =>
        {
          this.messageService.add(errorToastr("Error while fetching Car shades"));
          console.error(error);
        },
        complete: () => {
          this.spinner.hide(); 
        }
      });
  }

  view(formula) {
    this.spinner.show();
    this.formulaService.fetch(formula.code).subscribe({
      next: response => {
      if(response.code == 200) {
        this.codeHeader = formula;
        this.codeBody = response.data.slice();
        this.change();
        this.formulaVisible = true;
      }
      else {
        this.messageService.add(errorToastr("Error while fetching formula code"));
        console.error(response);
      }
      }, 
      error: error => {
        this.messageService.add(errorToastr("Error while fetching formula code"));
        console.error(error);
      },
      complete: () => {     
        this.spinner.hide();
      }
    });
  }

  filter() {
    let filteredProduct = $("#searchSuggestion").val().toLowerCase();
    //Visible fails if backspace is pressed
    $("#productView div").filter(function () {
        if($(this).text().toLowerCase().indexOf(filteredProduct) != -1)
            $(this).show();
        else
            $(this).hide();
    });
  }

  change() {
    if(this.qty == 0) {
      return;
    }
    this.codeBodyml = [];
    this.codeBody.forEach(element => {
      let code = {...element};
      code.price = parseFloat((element.price*this.qty/1000).toFixed(2));
      code.weight = parseFloat((element.weight*this.qty/1000).toFixed(2));
      this.codeBodyml.push(code);
    })
  }
}

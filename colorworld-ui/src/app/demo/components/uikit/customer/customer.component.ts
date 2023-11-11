import * as $ from 'jquery';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Customer } from 'src/app/demo/domain/customer';
import { CustomersService } from 'src/app/demo/service/customers.service';
import {
    errorToastr,
    successToastr,
} from 'src/app/demo/service/apputils.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss'],
    providers: [ConfirmationService, MessageService],
})
export class CustomerComponent implements OnInit {
    customerDetails: Customer = new Customer();
    customerData = [];

    constructor(
        private spinner: NgxSpinnerService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private customerService: CustomersService
    ) {}

    ngOnInit() {
        this.fetchAll();
    }

    fetchAll() {
        this.spinner.show();
        this.customerService.fetchAll().subscribe({
            next: response => {
                if (response.code == 200) {
                    response.data.forEach((element) => {
                        element.jpmobno = element.jpmobno || '';
                    });
                    this.customerData = response.data;
                }
            },
            error: error => {
                console.error(error);
                this.messageService.add(errorToastr("Error fetching Customer Details"));
            },
            complete:() => this.spinner.hide()
        });
    }
    search(event) {
        let searchValue = $(event.srcElement).val();
        $('.cust_row').each(function () {
            let cust_row = this;
            $(cust_row).toggle(
                $(cust_row)
                    .text()
                    .toLowerCase()
                    .indexOf(searchValue.toLowerCase()) > -1
            );
        });
    }

    selectCustomer(cust: Customer) {
        this.customerDetails = { ...cust };
    }

    delete(cust) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.customerService.delete(cust.jpid).subscribe({
                    next: response => {
                        if (response.code == 200) {
                            this.messageService.add(
                                successToastr('Customer deleted successfully!!')
                            );
                            window.location.reload();
                        } else {
                            this.messageService.add(
                                errorToastr(response.errMessage)
                            );
                        }
                    },
                    error: error => {
                        console.error(error);
                        this.messageService.add(
                            errorToastr(error.error.message)
                        );
                    },
                    complete:() => this.spinner.hide()
                });
            },
        });
    }

    save() {
        let status = 'updated';
        if (
            this.customerDetails.jpid == '0' ||
            this.customerDetails.jpid == ''
        ) {
            status = 'saved';
        }
        this.spinner.show();
        this.customerService.add(this.customerDetails).subscribe({
            next: response => {
                if (response.code == 200) {
                    this.messageService.add(
                        successToastr(
                            `Customer Details ${status} successfully!!`
                        )
                    );
                    window.location.reload();
                } else {
                    this.messageService.add(
                        errorToastr(JSON.stringify(response.data))
                    );
                }
            },
            error: error => {
                console.error(error);
                this.messageService.add(errorToastr(error.error.message));
            },
            complete: () => this.spinner.hide()
        });
    }

    clear() {
        this.customerDetails = new Customer();
    }
}

import { NgForm } from "@angular/forms";

export abstract class AbstractForm {
    showError(input: any, form: NgForm) {
        return input && input.invalid && (input.touched || form.submitted);
    }

}
import { NgForm } from "@angular/forms";

export abstract class AbstractForm {
    showError(input: any, form: NgForm) {
        return input && input.invalid && (input.touched || form.submitted);
    }

    convertToDate(data: any) {
        let dataString = data.toString();
        let partesData = dataString.split('/');
        let novaData = new Date(partesData[2], partesData[1] - 1, partesData[0]);
        return novaData;
    }

    deepcopy<T>(o: T): T {
        return JSON.parse(JSON.stringify(o));
    }

}
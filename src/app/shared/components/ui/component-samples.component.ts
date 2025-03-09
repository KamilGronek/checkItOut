import { Component } from '@angular/core';
import {ButtonComponent} from "./button/button.component";
import {CardComponent} from "./card/card.component";
import {InputComponent} from "./input/input.component";
import {FormControl, Validators} from "@angular/forms";
import {LinkComponent} from "./link/link.component";
import {SelectComponent} from "./select/select.component";
import {MatTableDataSource} from "@angular/material/table";
import {TableComponent} from "./table/table.component";
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-component-samples',
  standalone: true,
    imports: [
        ButtonComponent,
        CardComponent,
        InputComponent,
        LinkComponent,
        SelectComponent,
        TableComponent,
        MatFormFieldModule,
    ],
  templateUrl: './component-samples.component.html',
})
export class ComponentSamplesComponent {
    // Form controls for input examples
    imageControl = new FormControl('', [Validators.required]);
    textControl = new FormControl('', [Validators.required]);
    passwordControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
    emailControl = new FormControl('', [Validators.required, Validators.email]);
    searchControl = new FormControl('');
    checkboxControl = new FormControl(false);

    // Card click event handler
    handleCardClick(): void {
        alert("Card clicked");
    }

    onImageUpload(){
        alert(this.imageControl.value);
        console.log(this.imageControl);
    }

    // Form control for select example
    selectControl = new FormControl('');
    selectControlSelected = new FormControl('option2');

    // Options for the select component
    selectOptions: { label: string; value: string }[] = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
        { label: 'Option 4', value: 'option4' }
    ];

    // Sample data for table
    tableColumns = [
        { key: 'name', label: 'Name' },
        { key: 'position', label: 'Position' },
        { key: 'weight', label: 'Weight' },
        { key: 'symbol', label: 'Symbol' }
    ];

    tableData = new MatTableDataSource([
        {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', description: 'Hydrogen is the lightest element.'},
        {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', description: 'Helium is a noble gas.'},
        {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', description: 'Lithium is a soft, silvery-white alkali metal.'},
        {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', description: 'Beryllium is a relatively rare element.'},
        {position: 5, name: 'Boron', weight: 10.811, symbol: 'B', description: 'Boron is a metalloid.'}
    ]);
}

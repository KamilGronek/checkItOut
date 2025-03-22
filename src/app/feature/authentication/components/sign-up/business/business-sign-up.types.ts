import {FormControl, FormGroup} from "@angular/forms";
import {Option} from "../../../../../shared/components/ui/select/select.types";

type BusinessFormGroup = {
    logo: FormControl<string | null>;
    name: FormControl<string | null>;
    description: FormControl<string | null>;
    category: FormControl<string | number | boolean | null>;
    country: FormControl<string | null>;
    address: FormGroup<{
        street: FormControl<string | null>
        city: FormControl<string | null>
        state: FormControl<string | null>
        zip: FormControl<string | null>
    }>;
    phone: FormControl<string | null>;
    email: FormControl<string | null>;
}

type BusinessRepresentativeForm = {
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    email: FormControl<string | null>;
    phone: FormControl<string | null>;
}

type AccountCredentialsForm = {
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
    termsOfService: FormControl<boolean>;
}

const businessCategories: Option[] = [
    { value: 'ecommerce_retail', label: 'E-commerce & Retail' },
    { value: 'professional_services', label: 'Professional Services' },
    { value: 'marketing_advertising', label: 'Marketing & Advertising' },
    { value: 'it_technology', label: 'IT & Technology' },
    { value: 'graphic_design_multimedia', label: 'Graphic Design & Multimedia' },
    { value: 'photography_video', label: 'Photography & Video' },
    { value: 'education_training', label: 'Education & Training' },
    { value: 'health_beauty', label: 'Health & Beauty' },
    { value: 'tourism_hospitality', label: 'Tourism & Hospitality' },
    { value: 'construction_renovation', label: 'Construction & Renovation' },
    { value: 'automotive_transportation', label: 'Automotive & Transportation' },
    { value: 'entertainment_arts', label: 'Entertainment & Arts' },
    { value: 'finance_investments', label: 'Finance & Investments' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'manufacturing_industry', label: 'Manufacturing & Industry' },
    { value: 'agriculture_sustainability', label: 'Agriculture & Sustainability' },
    { value: 'pet_care', label: 'Pet Care' },
    { value: 'event_planning', label: 'Event Planning' },
    { value: 'home_services', label: 'Home Services' },
    { value: 'other', label: 'Other' },
];

const businessCategoryDefault: Option = { value: 'ecommerce_retail', label: 'E-commerce & Retail' };

export { BusinessFormGroup, BusinessRepresentativeForm, AccountCredentialsForm, businessCategories, businessCategoryDefault };

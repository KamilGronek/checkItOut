type MatInputType =
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'tel'
    | 'url'
    | 'search'
    | 'date'
    | 'datetime-local'
    | 'month'
    | 'week'
    | 'time';

type OtherInputType = 'checkbox' | 'textarea' | 'image';

export { MatInputType, OtherInputType };

import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';

const requestStream = of('https://api.github.com/users');

requestStream.subscribe(
    (requestUrl) => {
        ajax.getJSON(requestUrl).subscribe(
            (res) => console.log(res),
            (err) => console.log(err),
        );
    },
    (err) => console.log(err),
);

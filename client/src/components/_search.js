// TODO: Move this?
export function searchHTML(str, query) {
    var pos = [],
        count = 0;

    for (var i = 0; i < str.length; i++) {
        // skip tags
        if (str[i] === '<') {
            while (str[i] !== '>') i++;
            continue;
        }

        // next char found?
        if (str[i].toLowerCase() === query[count].toLowerCase()) {
            pos.push(i);
            count++;
            if (count === query.length) { count = 0; }
        }
        else {
            while (count !== 0) { pos.pop(); count--; }
        }
    }

    // incomplete query at the end of string
    while (count !== 0) { pos.pop(); count--; }

    return pos;
}
create table element_categories
(
    id      text not null primary key,
    name    text not null,
    created int  not null
);

create table elements
(
    id          text not null primary key,
    category_id text not null references element_categories (id),
    name        text not null,
    framecount  int  not null,
    framerate   int  not null,
    channels    text not null,
    alpha       int  not null,
    previews    int  not null,
    created     int  not null
);

create table element_versions
(
    id         text not null primary key,
    element_id text not null references elements (id),
    name       text not null,
    width      int  not null,
    height     int  not null,
    filetype   text not null
);

create table element_frames
(
    id         text not null primary key,
    element_id text not null references elements (id),
    number     int  not null,
    transcoded int  not null
);

-- Testdata

insert into element_categories (id, name, created)
values ('v1f', 'Fire', 0),
       ('esu', 'Blood', 0),
       ('xfn', 'Smoke', 0),
       ('9ej', 'Particles', 0);

insert into elements (id, category_id, name, framecount, framerate, channels, alpha, previews, created)
values ('bnfu', 'v1f', 'Fire from below', 120, 30, 'RGB', 0, 1, 0),
       ('3uvm', 'v1f', 'Fire from above', 180, 30, 'RGB', 0, 1, 0),
       ('vmfa', 'v1f', 'Fire from within', 240, 60, 'RGBA', 1, 1, 0),
       ('ufra', 'esu', 'Blood splatter 1', 120, 30, 'RGBA', 1, 1, 0),
       ('u3rn', 'esu', 'Blood splatter 2', 160, 30, 'RGBA', 1, 1, 0),
       ('qwfv', 'esu', 'Blood splatter 3', 180, 30, 'RGBA', 1, 1, 0);

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

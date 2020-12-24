create table tags
(
    id   text not null primary key,
    name text not null
);

create table element_tags
(
    element_id text not null references elements (id),
    tag_id     text not null references tags (id)
);

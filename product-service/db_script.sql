create table products (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    price integer
)

create table stocks (
    product_id uuid,
    counts integer,
    foreign key ("product_id") references "products" ("id")
)

insert into products (title, description, price) values
('Mars For Everyone', 'App for finding cheap flights to Mars', 2),
('Venus On Your Plate', 'App for ordering food from Venus', 10),
('Sweet Home Jupiter', 'App for buying houses on Jupiter', 23),
('Mind Galaxy', 'App for studying online with best mentors from our galaxy', 15),
('Best Jobs On Saturn', 'App for finding a job of your dream on Saturn', 23)

insert into stocks (product_id, counts) values
('35607059-dcec-4196-ae9e-7f2ccddaeafb', 4),
('b06dd9ec-1e15-46ae-867a-66893f663323', 6),
('6f716133-544d-4d1c-a3d4-da964eafc018', 7),
('3286afed-17f9-45b3-b2e0-f2fa907c6606', 12),
('e3af300b-65d0-45b3-8ee2-fe9358c7d866', 7)

create extension if not exists "uuid-ossp";
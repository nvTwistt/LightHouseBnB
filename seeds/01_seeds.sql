INSERT INTO users (id,name, email, password)
VALUES (1,'Matthew Tamkee', 'mtamkee@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(2,'Michael Tamkee', 'mjtamkee@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(3,'Susanah Fallis', 'sfallis@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(4,'Ajax Tamkee', 'atamkee@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES(1,1,'Speed lamp','description','https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350','https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg',930.61,6,4,8,'Canada','536 Namsub Highway','Sotboske','Quebec','28142',true),
(2,2,'Blank corner', 'description' ,'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350','https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',85234,6,6,7,'Canada','651 Nami Road','Bohbatev','Alberta','83680',true),
(3,3,'Habit mix','description','https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350','https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg',46058,0,5,6,'Canada','1650 Hejto Center ','Genwezuj ','Newfoundland And Labrador','44583',true);

INSERT INTO reservations (id, start_date, end_date, property_id, guest_id)
VALUES 
(1, '2018-09-11', '2018-09-26',1,1),
(2,'2019-01-04', '2019-02-01',2,2),
(4,'2019-02-04', '2019-03-01',2,4),
(3, '2021-10-01', '2021-10-14',3,3);

INSERT INTO property_reviews(id,guest_id,property_id,reservation_id,rating,message)
VALUES
(1,1,1,1,5,'messages'),
(2,2,2,2,5,'messages'),
(3,4,2,4,5,'messages'),
(5,3,3,3,5,'messages');

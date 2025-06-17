SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '96191776-e101-430e-942d-381a57777bec', '{"action":"user_confirmation_requested","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-06-09 19:27:14.954598+00', ''),
	('00000000-0000-0000-0000-000000000000', '2dcf6101-cc2d-4add-9ee8-2553df7bc02f', '{"action":"user_signedup","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"team"}', '2025-06-09 19:27:32.665579+00', ''),
	('00000000-0000-0000-0000-000000000000', '1262b08b-7b77-4f5b-a2ed-0f4f8866e784', '{"action":"token_refreshed","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-10 04:04:55.997957+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b0536631-3c15-4852-860c-3c35f14b603b', '{"action":"token_revoked","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-10 04:04:56.002627+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c1b642ed-6cef-4dc2-b796-b6bd88a4a99c', '{"action":"token_refreshed","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-10 05:47:01.465044+00', ''),
	('00000000-0000-0000-0000-000000000000', '6061990e-c9c3-47db-80e0-8bc45ea7ef57', '{"action":"token_revoked","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-10 05:47:01.465792+00', ''),
	('00000000-0000-0000-0000-000000000000', '18ad6767-893a-4b88-8983-c3f01225232f', '{"action":"token_refreshed","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-10 13:40:58.783031+00', ''),
	('00000000-0000-0000-0000-000000000000', '1a6c1460-5235-428e-ae0b-fc34e5e9308f', '{"action":"token_revoked","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-10 13:40:58.790177+00', ''),
	('00000000-0000-0000-0000-000000000000', '18cc490e-bec3-422d-bcf5-82ec8d33e894', '{"action":"logout","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"account"}', '2025-06-10 13:41:08.022501+00', ''),
	('00000000-0000-0000-0000-000000000000', '58f26c08-4fbc-47c6-b96b-e7b77da46fb7', '{"action":"user_confirmation_requested","actor_id":"bf7775d8-04ab-4010-a479-07437bbbfd0f","actor_name":"Danilo Menezes","actor_username":"danilomenezes@protonmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-06-10 13:42:27.877648+00', ''),
	('00000000-0000-0000-0000-000000000000', '704a5c84-ca22-436d-ac67-d5ec0d8655eb', '{"action":"user_confirmation_requested","actor_id":"c09049d5-9ac2-458f-8730-c9166c4cb845","actor_name":"Danilo Menezes","actor_username":"danilomenezes@proton.me","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-06-10 13:44:19.312053+00', ''),
	('00000000-0000-0000-0000-000000000000', '334349fe-9243-4799-9fc8-eb2355340eb0', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"danilomenezes@protonmail.com","user_id":"bf7775d8-04ab-4010-a479-07437bbbfd0f","user_phone":""}}', '2025-06-10 13:45:01.204476+00', ''),
	('00000000-0000-0000-0000-000000000000', '51d7fc96-63ba-4717-a2ce-ba02a0d49b28', '{"action":"user_confirmation_requested","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-06-10 13:49:57.560523+00', ''),
	('00000000-0000-0000-0000-000000000000', '77d417c3-4b0b-4c00-adef-827955be0efa', '{"action":"user_signedup","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"team"}', '2025-06-10 13:50:39.055716+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bcc03691-0328-4600-9eb7-d91a868ece4a', '{"action":"user_recovery_requested","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"user"}', '2025-06-10 14:09:38.675235+00', ''),
	('00000000-0000-0000-0000-000000000000', '562f8159-5323-4945-8684-e41e268dccf7', '{"action":"login","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"account"}', '2025-06-10 14:10:21.047096+00', ''),
	('00000000-0000-0000-0000-000000000000', '1b43e625-c330-4590-a65e-0efbb5e973c1', '{"action":"logout","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"account"}', '2025-06-10 15:04:13.391186+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bff6cab3-e3ee-48f9-9058-c46367901ecc', '{"action":"user_recovery_requested","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"user"}', '2025-06-10 15:04:18.425184+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a1055592-f1d2-4a71-a1a7-1f611fea2f6d', '{"action":"login","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"account"}', '2025-06-10 15:04:30.140647+00', ''),
	('00000000-0000-0000-0000-000000000000', '1d3c6127-9956-40a2-9f35-37da45dd014f', '{"action":"user_recovery_requested","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"user"}', '2025-06-10 15:05:47.204613+00', ''),
	('00000000-0000-0000-0000-000000000000', '86eb4c92-367b-4ceb-8df2-2ea4207594b5', '{"action":"login","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"account"}', '2025-06-10 15:06:03.36147+00', ''),
	('00000000-0000-0000-0000-000000000000', '8e90fe70-6145-492a-a39e-9a8d547c3fcc', '{"action":"user_recovery_requested","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"user"}', '2025-06-10 15:10:10.516699+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a82be54f-47ee-4c32-a2d1-336dff09fe6f', '{"action":"login","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"account"}', '2025-06-10 15:10:19.27353+00', ''),
	('00000000-0000-0000-0000-000000000000', '6a4296ed-2363-4bc2-a90e-dcf277786bde', '{"action":"logout","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"account"}', '2025-06-10 15:14:08.006614+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd35e4ba9-721b-4730-983d-a3a8098fdf06', '{"action":"user_recovery_requested","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"user"}', '2025-06-10 15:14:15.048615+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd08737e8-d716-4796-a221-c4d397f206f0', '{"action":"login","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"account"}', '2025-06-10 15:14:28.100525+00', ''),
	('00000000-0000-0000-0000-000000000000', '925a92f1-9b5c-4f88-b240-8cdc22e12307', '{"action":"logout","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"account"}', '2025-06-10 15:49:46.48811+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ab577520-9fea-48f9-8f8d-90938085bf5b', '{"action":"user_recovery_requested","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"user"}', '2025-06-10 15:49:51.014429+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c7dd0272-7bea-4e19-a2f2-b9591d6819d6', '{"action":"login","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"account"}', '2025-06-10 15:50:04.687199+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ef27d5f1-2c59-45d8-b68d-fc62bc3b382d', '{"action":"token_refreshed","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-10 21:46:32.798595+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a284c164-128f-4d7f-bf4f-a8f16421df1e', '{"action":"token_revoked","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-10 21:46:32.808337+00', ''),
	('00000000-0000-0000-0000-000000000000', '4a936f3e-1b9c-4590-854d-cb2d561d7bdb', '{"action":"token_refreshed","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-10 21:48:19.332815+00', ''),
	('00000000-0000-0000-0000-000000000000', '94921acf-f87d-4d75-ba8e-657162133924', '{"action":"token_revoked","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-10 21:48:19.333628+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e3417fb8-dba5-4927-a243-c7ccdda84630', '{"action":"token_refreshed","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-11 02:08:50.712341+00', ''),
	('00000000-0000-0000-0000-000000000000', '5720cde4-135c-46c6-bd67-7c175b288570', '{"action":"token_revoked","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-11 02:08:50.720725+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fe9ea648-20ab-4723-947b-829ee09b173a', '{"action":"token_refreshed","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-11 02:08:52.822508+00', ''),
	('00000000-0000-0000-0000-000000000000', '8d9c9e21-32a2-4c90-bd51-b4d094e46514', '{"action":"token_refreshed","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-11 02:08:52.836304+00', ''),
	('00000000-0000-0000-0000-000000000000', '8ea9493f-447f-4a60-8f7b-dded4a2e08cc', '{"action":"token_refreshed","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-11 02:08:52.932594+00', ''),
	('00000000-0000-0000-0000-000000000000', 'adc50f7e-69c3-4d23-ade0-366e01c47aed', '{"action":"token_refreshed","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-11 02:08:53.219343+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a306067c-3841-4b65-9a28-93169f977c66', '{"action":"token_refreshed","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-11 02:08:53.248802+00', ''),
	('00000000-0000-0000-0000-000000000000', '1ae59c4d-4485-464d-a60a-edeab5c7e18a', '{"action":"token_refreshed","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-11 02:08:53.30447+00', ''),
	('00000000-0000-0000-0000-000000000000', '2cf5f22c-0027-4edd-92fa-9b13f1585d36', '{"action":"token_refreshed","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-11 02:08:53.349085+00', ''),
	('00000000-0000-0000-0000-000000000000', '6cc09670-f3be-4853-9429-807a40977271', '{"action":"token_refreshed","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-11 16:34:59.388109+00', ''),
	('00000000-0000-0000-0000-000000000000', '0ec09d96-abcf-48c7-8a28-fb6525f8eba0', '{"action":"token_revoked","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-11 16:34:59.405249+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e8e049fe-9937-4644-b620-b86b782431fc', '{"action":"token_refreshed","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-11 16:55:36.05386+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a37bf069-e444-45a0-b12a-640430c65bcb', '{"action":"token_revoked","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-11 16:55:36.056081+00', ''),
	('00000000-0000-0000-0000-000000000000', '6863f487-1728-44f1-9b4c-bb95e25b6905', '{"action":"token_refreshed","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-11 16:55:36.297172+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ba898318-dcc1-41f4-a519-8fda6affd273', '{"action":"logout","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-11 16:55:36.451483+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ffb15369-b7ee-4201-887a-464d2935eea6', '{"action":"login","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 16:55:53.265865+00', ''),
	('00000000-0000-0000-0000-000000000000', '4857f33c-40c5-4d4a-8b4e-08757064b84d', '{"action":"login","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 20:42:51.603456+00', ''),
	('00000000-0000-0000-0000-000000000000', 'db813114-add6-4ba1-84f9-363f8bbf3b87', '{"action":"token_refreshed","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-11 20:45:44.828853+00', ''),
	('00000000-0000-0000-0000-000000000000', '387d16e6-d4b3-4eb9-8940-ae374e202fe6', '{"action":"token_revoked","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"token"}', '2025-06-11 20:45:44.830535+00', ''),
	('00000000-0000-0000-0000-000000000000', '7a9c372b-7200-47ea-851d-92b6778bb010', '{"action":"login","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 20:46:55.535774+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c3a47e84-aff8-4d7b-8f37-5a2cf60c6b81', '{"action":"logout","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"account"}', '2025-06-11 20:55:10.955057+00', ''),
	('00000000-0000-0000-0000-000000000000', 'caced66d-d481-49d9-bbfd-4c675afce4eb', '{"action":"logout","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-11 20:55:21.77361+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e7798735-e3eb-4513-b97f-4c2a9ced6254', '{"action":"user_recovery_requested","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"user"}', '2025-06-11 20:57:25.700779+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd9b7ba9f-04f4-4a77-a1b0-8ca5d33f3e66', '{"action":"login","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"account"}', '2025-06-11 20:57:46.571863+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c7b80569-700a-43c6-9132-6294159972a7', '{"action":"logout","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"account"}', '2025-06-11 20:59:14.57342+00', ''),
	('00000000-0000-0000-0000-000000000000', '8e60cd4e-d01d-4801-b27f-44e36239524f', '{"action":"user_recovery_requested","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"user"}', '2025-06-11 20:59:36.345119+00', ''),
	('00000000-0000-0000-0000-000000000000', '599e3fb8-c155-4e14-8d15-6c71720212cc', '{"action":"login","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-11 21:00:14.533252+00', ''),
	('00000000-0000-0000-0000-000000000000', '106b791e-9c6b-4300-bc41-9ead5f04c6e2', '{"action":"token_refreshed","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-11 21:00:14.547896+00', ''),
	('00000000-0000-0000-0000-000000000000', '78b2f584-4b16-4338-8702-1a73b73c4553', '{"action":"token_revoked","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-11 21:00:14.548661+00', ''),
	('00000000-0000-0000-0000-000000000000', '29f10037-fd68-4b81-bbec-057506927489', '{"action":"user_updated_password","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"user"}', '2025-06-11 21:00:43.236555+00', ''),
	('00000000-0000-0000-0000-000000000000', '2d70d89d-1245-4217-bc04-62c04774364a', '{"action":"user_modified","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"user"}', '2025-06-11 21:00:43.237212+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a361e80-b9b0-4b78-8e40-87cf54c25911', '{"action":"user_recovery_requested","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"user"}', '2025-06-11 21:01:26.521038+00', ''),
	('00000000-0000-0000-0000-000000000000', '88f1e776-828d-42a8-a811-29147d3a6899', '{"action":"login","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"account"}', '2025-06-11 21:01:50.22785+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e2ce29b0-f6a8-49a6-af4a-b95ec8bb0f42', '{"action":"logout","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"account"}', '2025-06-11 21:02:56.822325+00', ''),
	('00000000-0000-0000-0000-000000000000', '5160b3c1-7771-44f8-ac4d-76ec890b4f8b', '{"action":"user_recovery_requested","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"user"}', '2025-06-11 21:03:13.859175+00', ''),
	('00000000-0000-0000-0000-000000000000', '4ab4db1e-ce02-49b4-9078-143207ad0865', '{"action":"login","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 21:03:28.219463+00', ''),
	('00000000-0000-0000-0000-000000000000', '487e2820-c6c2-4476-be79-1a18031e3370', '{"action":"logout","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-11 21:11:54.975093+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c24f9fcf-e1a8-4b3d-ae1c-71a16f85227b', '{"action":"user_recovery_requested","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"user"}', '2025-06-11 21:15:00.880884+00', ''),
	('00000000-0000-0000-0000-000000000000', '5f068d9c-60b7-4b17-9a83-64fb5a7a12d2', '{"action":"login","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"account"}', '2025-06-11 21:15:18.400043+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f7ed2898-6c14-4fae-b4e7-30b5a2203ce5', '{"action":"login","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 21:20:31.180465+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cee91d6b-0c1e-4427-ac87-7300fa7de341', '{"action":"logout","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"account"}', '2025-06-11 21:29:02.042774+00', ''),
	('00000000-0000-0000-0000-000000000000', '6004f30b-5f0b-467f-91bb-78440b8efead', '{"action":"login","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-11 21:29:16.941346+00', ''),
	('00000000-0000-0000-0000-000000000000', '55bc0963-8aa5-4e4e-a54d-f8a752fd06f2', '{"action":"token_refreshed","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-12 17:34:07.357097+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a6a5dcd7-5f9f-4aff-aa95-ba884cd36003', '{"action":"token_revoked","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-12 17:34:07.373158+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e27620fd-91d8-4e74-87fe-e7260300c49d', '{"action":"token_refreshed","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-13 13:54:16.271106+00', ''),
	('00000000-0000-0000-0000-000000000000', '1d4e1ad0-e24e-48d1-83a1-659aa1917b06', '{"action":"token_revoked","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-13 13:54:16.282947+00', ''),
	('00000000-0000-0000-0000-000000000000', '7e09ff64-1f77-4e5b-b671-bda1e5e3a3a5', '{"action":"token_refreshed","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-13 17:11:38.430214+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e95dc437-2de9-478f-80d6-70c0789e7fde', '{"action":"token_revoked","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-13 17:11:38.432905+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aedbdb16-59a3-4492-8b54-ce2dbcd371d4', '{"action":"token_refreshed","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-13 17:11:39.103759+00', ''),
	('00000000-0000-0000-0000-000000000000', '31d62f33-87cd-474a-b89f-a108ea55b2b8', '{"action":"token_refreshed","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-13 17:11:40.386708+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e73cbfd8-6580-43ee-a074-b42e166ae979', '{"action":"token_refreshed","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-13 17:11:40.535089+00', ''),
	('00000000-0000-0000-0000-000000000000', '0a30925e-f274-467f-b54a-19d809b037bb', '{"action":"token_refreshed","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-13 17:11:40.763775+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ede728bb-f7b0-4211-81d9-aa687b362be8', '{"action":"token_refreshed","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-13 17:11:40.864199+00', ''),
	('00000000-0000-0000-0000-000000000000', '58a7f167-eff0-4d1d-a33c-3d5bd20e98eb', '{"action":"token_refreshed","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-13 17:11:40.928531+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c908b4a3-48a4-4e89-89b8-e7f290957a02', '{"action":"token_refreshed","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-13 17:11:40.988794+00', ''),
	('00000000-0000-0000-0000-000000000000', '4aa3479f-ec68-4f68-b062-e5e14a5f89c5', '{"action":"token_refreshed","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-13 17:11:41.024585+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a69de7cf-f614-41ab-9976-10281845e576', '{"action":"token_refreshed","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-17 16:49:41.601058+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b8a6ad04-2de4-462e-a47d-9a4b77b32b07', '{"action":"token_revoked","actor_id":"8559d296-e234-4e40-9036-6382411a37c2","actor_name":"Jace Perry","actor_username":"jace.investor@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-06-17 16:49:41.613312+00', ''),
	('00000000-0000-0000-0000-000000000000', '7871afbc-07d6-45de-89a1-8b84a907806b', '{"action":"user_recovery_requested","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"user"}', '2025-06-17 19:55:34.84774+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c6da3f84-592c-4540-8ed8-4699d200e107', '{"action":"login","actor_id":"f68e519a-562b-4fd3-8480-f6b18c7d7498","actor_name":"Danilo Menezes","actor_username":"danilocoding@pm.me","actor_via_sso":false,"log_type":"account"}', '2025-06-17 19:55:49.098709+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") VALUES
	('ea19171a-4dfe-4cbb-abd3-ca784771cb9d', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '3a26ef7e-007e-47bf-acdd-c28a7f9006f6', 's256', 'h2KBhLq0EV_2mO3m-PFpvILEe64NxBRU2qcujOHQTxY', 'email', '', '', '2025-06-09 19:27:14.958118+00', '2025-06-09 19:27:14.958118+00', 'email/signup', NULL),
	('2c43b4c4-a9f1-49c8-82fc-ae7008231577', 'bf7775d8-04ab-4010-a479-07437bbbfd0f', '09b21d42-ba98-4eeb-809a-68b8c6b894e9', 's256', 'zKAdX6-t2u4aSHLaJH8u17BHDsc--6ePbjDrMjfmg6Q', 'email', '', '', '2025-06-10 13:42:27.878308+00', '2025-06-10 13:42:27.878308+00', 'email/signup', NULL),
	('30c13fef-792e-4ecf-ab7e-a960cbc586dd', 'c09049d5-9ac2-458f-8730-c9166c4cb845', 'a52d4fd5-ce65-4a1d-8c9c-75b4a6e22a70', 's256', 'DMZOz7UQWIJvpJG_UnemkdyKZtPDNrjM9o1dFYEGHq0', 'email', '', '', '2025-06-10 13:44:19.313378+00', '2025-06-10 13:44:19.313378+00', 'email/signup', NULL),
	('569b5b42-fdd3-46c1-8da3-580c58b95ae8', '8559d296-e234-4e40-9036-6382411a37c2', 'cffb076f-3512-41a3-9a8e-3777a523e831', 's256', '4Mn04lyMT9w9m5a7mQKO9bvYjzi-xO5k3oVPUyUYABw', 'email', '', '', '2025-06-10 13:49:57.561909+00', '2025-06-10 13:49:57.561909+00', 'email/signup', NULL),
	('67203b83-ed81-46b3-ba9c-63ba51a7f17b', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '8b5927b1-bac8-4bce-8b3b-e63a3fd169f6', 's256', 'kmaVQVkn0MLRVLNEgLdZJVGf_oNNd-6LKCVnaQmshFI', 'magiclink', '', '', '2025-06-10 14:09:38.67265+00', '2025-06-10 14:09:38.67265+00', 'magiclink', NULL),
	('921db9d2-4a36-4bb6-992f-7a7f72e6446d', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '2b44630b-9c7d-459a-a6c1-ce07f1b7fc60', 's256', '-5ABF4Cq0oA-BawPw3jdFB73tj6UQoJFwzdhx4oAzII', 'magiclink', '', '', '2025-06-10 15:04:18.423441+00', '2025-06-10 15:04:18.423441+00', 'magiclink', NULL),
	('87b292b4-d458-4335-a69c-cb95f9db937d', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', 'cd753566-c689-4fc8-9bc4-4b38abdb36d6', 's256', 'gZ8yGorxJKH0T1scETamC_WeHZtMaiKqI959TVC_sAI', 'magiclink', '', '', '2025-06-10 15:05:17.189175+00', '2025-06-10 15:05:17.189175+00', 'magiclink', NULL),
	('b352667e-f70b-4f19-90c8-f6e7220e68cf', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', 'e448d27d-0346-4ecb-87bc-bfc67b8fd381', 's256', 'ylJx_Bk_2L517dN_HMs_9J154iuCo1lNvUfseuma3Kk', 'magiclink', '', '', '2025-06-10 15:05:47.201802+00', '2025-06-10 15:05:47.201802+00', 'magiclink', NULL),
	('19af1326-e348-4e17-acd2-446f7e793459', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', 'e1ae3d73-9b77-447c-b908-d43f94a6429f', 's256', 'Nq0XWmwZdzXSmvZ0UuL7bIVQg6YQXJ_zDFKKFsDrCro', 'magiclink', '', '', '2025-06-10 15:10:10.514514+00', '2025-06-10 15:10:10.514514+00', 'magiclink', NULL),
	('84db221d-53c4-4296-a1b0-057215fa0411', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '9537c5cd-bdc1-4100-b322-d360d29b5f29', 's256', 'HQ3R1Wkgy_eLPyh_nXxGC7XkfW9OYBO9r8Vf5C4lA6A', 'magiclink', '', '', '2025-06-10 15:14:15.045834+00', '2025-06-10 15:14:15.045834+00', 'magiclink', NULL),
	('a495ef1e-1f2f-4220-9f98-4115ce4f16d9', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', 'f6a4ee86-123a-4bac-9e15-68368f2f6454', 's256', '-sKUY_B9HFgbNwKC_7H00sUVObEKoU_4HEXM8YTS5iY', 'magiclink', '', '', '2025-06-10 15:49:51.011368+00', '2025-06-10 15:49:51.011368+00', 'magiclink', NULL),
	('6b75ee00-7adf-43b2-8676-8246ac827d14', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', 'ad0ccd0b-e3d5-4637-b0ac-43d88ab0a9db', 's256', 'w-p6tb4TmYgP2kh1oSQ33VZCpWbABEJ0RUYlJsj8iVU', 'recovery', '', '', '2025-06-11 20:57:25.691187+00', '2025-06-11 20:57:25.691187+00', 'recovery', NULL),
	('42873823-8687-4d2e-bf1f-c278ae23f391', '8559d296-e234-4e40-9036-6382411a37c2', 'b9c3b1e6-c654-487e-a85b-7b90b87b29e8', 's256', '5sTiRIhLRBRhqRpzYOOOGPohMyy144DpcmlE8Hzwi6Y', 'recovery', '', '', '2025-06-11 20:59:36.341766+00', '2025-06-11 20:59:36.341766+00', 'recovery', NULL),
	('a071503e-57a3-4eb6-b7e9-ec7f18e690b7', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '33549b91-7272-4275-bdb5-94acea916de5', 's256', 'fKaHqne8sqW_mD5dkogZ-V8rUzreokgwItdy7XIHJ38', 'magiclink', '', '', '2025-06-11 21:01:26.519097+00', '2025-06-11 21:01:26.519097+00', 'magiclink', NULL),
	('0af25906-afb1-4e84-ab9a-3410984e2bff', '8559d296-e234-4e40-9036-6382411a37c2', 'e4c8e938-bf19-43b1-91e0-3a64cc09561d', 's256', 'o3lPxsd3N-h1pw2x_Xu7wMhMKRCpyt3rMbuKL8ckK5w', 'magiclink', '', '', '2025-06-11 21:03:13.857369+00', '2025-06-11 21:03:13.857369+00', 'magiclink', NULL),
	('c25bb5c4-e6a2-4132-9fd0-59be633f6999', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '5bf9a470-8d51-4cfc-a9d6-51083fcddcc6', 's256', 'qJwq5ukuoKf10XNz3EvRsWncTOEMJBK024ph0e33Bj8', 'recovery', '', '', '2025-06-11 21:15:00.878858+00', '2025-06-11 21:15:00.878858+00', 'recovery', NULL),
	('72db2e36-e773-42f4-9af1-68187358111c', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '4e7079a0-edcd-48f0-a59a-28e1a634f5bd', 's256', 'FqiNQaxV1oJ2xqVh8gp-8r7TxyBbBlzxiqctXIdop_E', 'magiclink', '', '', '2025-06-17 19:55:34.830004+00', '2025-06-17 19:55:34.830004+00', 'magiclink', NULL);


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'aec53558-767e-4408-b4d6-1c1e6f17ffe5', 'authenticated', 'authenticated', 'user@example.com', '$2a$10$nnqTShcTX48N6QWWjbPUee.wrGz1kGx/uq5lORviCm.fn04W1BeRe', '2024-09-01 17:21:01.462788+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"username": "username", "full_name": "Test User"}', NULL, '2024-09-01 17:21:01.455486+00', '2024-09-01 17:21:01.46295+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'c09049d5-9ac2-458f-8730-c9166c4cb845', 'authenticated', 'authenticated', 'danilomenezes@proton.me', '$2a$10$PsartNFp.gSo1i5B9ZsZneV5AIeQ6FCsc4TgJD7rWWZazMp61k4Vi', NULL, NULL, 'pkce_b5351e4fd420162551a46a4cf4f6d38dbd862b433d7bab7e2443b318', '2025-06-10 13:44:19.314143+00', '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"sub": "c09049d5-9ac2-458f-8730-c9166c4cb845", "role": "investor", "email": "danilomenezes@proton.me", "full_name": "Danilo Menezes", "phone_number": "+13024501590", "email_verified": false, "phone_verified": false}', NULL, '2025-06-10 13:44:19.301765+00', '2025-06-10 13:44:19.750257+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '8559d296-e234-4e40-9036-6382411a37c2', 'authenticated', 'authenticated', 'jace.investor@gmail.com', '$2a$10$llok2YYJAMkp6EpvdzjutOsPt2rzTxo7.AgEuQawOYUCmdZ8qzQbq', '2025-06-10 13:50:39.056342+00', NULL, '', NULL, 'pkce_a9172b73279ee77a6005e85ced9c206a5146dfb9747fe9f3fca16fde', '2025-06-11 21:03:13.859665+00', '', '', NULL, '2025-06-11 21:29:16.942006+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "8559d296-e234-4e40-9036-6382411a37c2", "role": "investor", "email": "jace.investor@gmail.com", "full_name": "Jace Perry", "phone_number": "+16197641771", "email_verified": true, "phone_verified": false}', NULL, '2025-06-10 13:49:57.547388+00', '2025-06-17 16:49:41.629667+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', 'authenticated', 'authenticated', 'danilocoding@pm.me', '$2a$10$Qshy03ihdqPbIMrIHUfHBe8TtE4W2tgT1fzpb/Cov64bXdauCruhW', '2025-06-09 19:27:32.666164+00', NULL, '', '2025-06-09 19:27:14.965424+00', '', '2025-06-17 19:55:34.851913+00', '', '', NULL, '2025-06-17 19:55:49.106124+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "f68e519a-562b-4fd3-8480-f6b18c7d7498", "role": "investor", "email": "danilocoding@pm.me", "full_name": "Danilo Menezes", "phone_number": "+13024501590", "email_verified": true, "phone_verified": false}', NULL, '2025-06-09 19:27:14.931451+00', '2025-06-17 19:55:49.122611+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('aec53558-767e-4408-b4d6-1c1e6f17ffe5', 'aec53558-767e-4408-b4d6-1c1e6f17ffe5', '{"sub": "aec53558-767e-4408-b4d6-1c1e6f17ffe5", "email": "user@example.com", "email_verified": false, "phone_verified": false}', 'email', '2024-09-01 17:21:01.459821+00', '2024-09-01 17:21:01.459849+00', '2024-09-01 17:21:01.459849+00', 'c5e81668-437b-47c2-83e2-84b8566b3018'),
	('f68e519a-562b-4fd3-8480-f6b18c7d7498', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '{"sub": "f68e519a-562b-4fd3-8480-f6b18c7d7498", "role": "investor", "email": "danilocoding@pm.me", "full_name": "Danilo Menezes", "phone_number": "+13024501590", "email_verified": true, "phone_verified": false}', 'email', '2025-06-09 19:27:14.952023+00', '2025-06-09 19:27:14.952074+00', '2025-06-09 19:27:14.952074+00', '8866117c-0838-4139-a517-48b7242212cf'),
	('c09049d5-9ac2-458f-8730-c9166c4cb845', 'c09049d5-9ac2-458f-8730-c9166c4cb845', '{"sub": "c09049d5-9ac2-458f-8730-c9166c4cb845", "role": "investor", "email": "danilomenezes@proton.me", "full_name": "Danilo Menezes", "phone_number": "+13024501590", "email_verified": false, "phone_verified": false}', 'email', '2025-06-10 13:44:19.308379+00', '2025-06-10 13:44:19.308427+00', '2025-06-10 13:44:19.308427+00', '16599c2b-b370-445f-b081-3bcdf32da04d'),
	('8559d296-e234-4e40-9036-6382411a37c2', '8559d296-e234-4e40-9036-6382411a37c2', '{"sub": "8559d296-e234-4e40-9036-6382411a37c2", "role": "investor", "email": "jace.investor@gmail.com", "full_name": "Jace Perry", "phone_number": "+16197641771", "email_verified": true, "phone_verified": false}', 'email', '2025-06-10 13:49:57.557384+00', '2025-06-10 13:49:57.557435+00', '2025-06-10 13:49:57.557435+00', '7fbd72c7-d5b9-4351-aec5-19715f109fc5');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('c7231452-c774-441c-8382-25a123cda9b7', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '2025-06-10 15:04:30.143797+00', '2025-06-10 15:04:30.143797+00', NULL, 'aal1', NULL, NULL, 'node', '3.84.221.109', NULL),
	('22eb0aad-5e05-40d7-bab8-99c4b6bab3bf', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '2025-06-10 15:06:03.363357+00', '2025-06-10 15:06:03.363357+00', NULL, 'aal1', NULL, NULL, 'node', '54.160.180.233', NULL),
	('221208fc-213d-4bbe-b31f-8013a4203f7e', '8559d296-e234-4e40-9036-6382411a37c2', '2025-06-11 21:29:16.942079+00', '2025-06-11 21:29:16.942079+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '201.95.108.234', NULL),
	('408e2f2e-574d-48e6-8775-b34c2dd43913', '8559d296-e234-4e40-9036-6382411a37c2', '2025-06-11 21:20:31.183193+00', '2025-06-12 17:34:07.414386+00', NULL, 'aal1', NULL, '2025-06-12 17:34:07.413702', 'Vercel Edge Functions', '54.166.37.34', NULL),
	('d5ffa0ef-1a8e-4e29-ba2d-861bc549a514', '8559d296-e234-4e40-9036-6382411a37c2', '2025-06-11 21:00:14.536209+00', '2025-06-17 16:49:41.640018+00', NULL, 'aal1', NULL, '2025-06-17 16:49:41.638914', 'Vercel Edge Functions', '34.200.244.83', NULL),
	('7432cd31-1da1-4ca3-a140-c973cb672a05', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '2025-06-17 19:55:49.106201+00', '2025-06-17 19:55:49.106201+00', NULL, 'aal1', NULL, NULL, 'node', '13.221.104.173', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('c7231452-c774-441c-8382-25a123cda9b7', '2025-06-10 15:04:30.146871+00', '2025-06-10 15:04:30.146871+00', 'otp', '1adbafdc-c395-4246-8113-23ffc85d79ce'),
	('22eb0aad-5e05-40d7-bab8-99c4b6bab3bf', '2025-06-10 15:06:03.365126+00', '2025-06-10 15:06:03.365126+00', 'otp', '812455eb-0a1a-4732-a6d9-8b29c5605055'),
	('d5ffa0ef-1a8e-4e29-ba2d-861bc549a514', '2025-06-11 21:00:14.539684+00', '2025-06-11 21:00:14.539684+00', 'otp', '8d9872a3-aeac-48e2-8722-eb4e2f04f245'),
	('408e2f2e-574d-48e6-8775-b34c2dd43913', '2025-06-11 21:20:31.190857+00', '2025-06-11 21:20:31.190857+00', 'password', 'bd4c0fc5-4858-425b-8b72-ec81d25eef80'),
	('221208fc-213d-4bbe-b31f-8013a4203f7e', '2025-06-11 21:29:16.946548+00', '2025-06-11 21:29:16.946548+00', 'password', '1f5ff92a-992f-4aa2-a3ae-cf5d9169f381'),
	('7432cd31-1da1-4ca3-a140-c973cb672a05', '2025-06-17 19:55:49.123689+00', '2025-06-17 19:55:49.123689+00', 'otp', '5b486c1b-6e2f-486a-84a0-a3567f04c113');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") VALUES
	('5b0e25ee-3b10-4344-b7a3-d032ea8ec1a9', 'c09049d5-9ac2-458f-8730-c9166c4cb845', 'confirmation_token', 'pkce_b5351e4fd420162551a46a4cf4f6d38dbd862b433d7bab7e2443b318', 'danilomenezes@proton.me', '2025-06-10 13:44:19.752121', '2025-06-10 13:44:19.752121'),
	('3289dea2-fea5-4be3-9ba4-f7329503c51d', '8559d296-e234-4e40-9036-6382411a37c2', 'recovery_token', 'pkce_a9172b73279ee77a6005e85ced9c206a5146dfb9747fe9f3fca16fde', 'jace.investor@gmail.com', '2025-06-11 21:03:14.935226', '2025-06-11 21:03:14.935226');


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 41, '3irfaywt2zsd', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', false, '2025-06-10 15:04:30.144645+00', '2025-06-10 15:04:30.144645+00', NULL, 'c7231452-c774-441c-8382-25a123cda9b7'),
	('00000000-0000-0000-0000-000000000000', 42, 'zo6ljy6qimwx', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', false, '2025-06-10 15:06:03.364007+00', '2025-06-10 15:06:03.364007+00', NULL, '22eb0aad-5e05-40d7-bab8-99c4b6bab3bf'),
	('00000000-0000-0000-0000-000000000000', 62, 'b5ng7n4gisdj', '8559d296-e234-4e40-9036-6382411a37c2', false, '2025-06-11 21:29:16.943612+00', '2025-06-11 21:29:16.943612+00', NULL, '221208fc-213d-4bbe-b31f-8013a4203f7e'),
	('00000000-0000-0000-0000-000000000000', 61, 'ec3wm5j2trfw', '8559d296-e234-4e40-9036-6382411a37c2', true, '2025-06-11 21:20:31.187516+00', '2025-06-12 17:34:07.374295+00', NULL, '408e2f2e-574d-48e6-8775-b34c2dd43913'),
	('00000000-0000-0000-0000-000000000000', 63, 'idluyuuhzm7q', '8559d296-e234-4e40-9036-6382411a37c2', false, '2025-06-12 17:34:07.396277+00', '2025-06-12 17:34:07.396277+00', 'ec3wm5j2trfw', '408e2f2e-574d-48e6-8775-b34c2dd43913'),
	('00000000-0000-0000-0000-000000000000', 56, 'r34tlnybgrav', '8559d296-e234-4e40-9036-6382411a37c2', true, '2025-06-11 21:00:14.537062+00', '2025-06-13 13:54:16.28404+00', NULL, 'd5ffa0ef-1a8e-4e29-ba2d-861bc549a514'),
	('00000000-0000-0000-0000-000000000000', 64, 'npabfc7anfyd', '8559d296-e234-4e40-9036-6382411a37c2', true, '2025-06-13 13:54:16.29622+00', '2025-06-13 17:11:38.433468+00', 'r34tlnybgrav', 'd5ffa0ef-1a8e-4e29-ba2d-861bc549a514'),
	('00000000-0000-0000-0000-000000000000', 65, 'kcpch5ztfmfu', '8559d296-e234-4e40-9036-6382411a37c2', true, '2025-06-13 17:11:38.435862+00', '2025-06-17 16:49:41.614459+00', 'npabfc7anfyd', 'd5ffa0ef-1a8e-4e29-ba2d-861bc549a514'),
	('00000000-0000-0000-0000-000000000000', 66, 'e3bmwahffio6', '8559d296-e234-4e40-9036-6382411a37c2', false, '2025-06-17 16:49:41.625581+00', '2025-06-17 16:49:41.625581+00', 'kcpch5ztfmfu', 'd5ffa0ef-1a8e-4e29-ba2d-861bc549a514'),
	('00000000-0000-0000-0000-000000000000', 67, '7kansldetb7m', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', false, '2025-06-17 19:55:49.113004+00', '2025-06-17 19:55:49.113004+00', NULL, '7432cd31-1da1-4ca3-a140-c973cb672a05');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: asset_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."asset_types" ("id", "name", "description", "use_codes", "slug", "created_at", "updated_at") VALUES
	('6e1ce450-a1a0-4695-a035-bb2b245627e2', 'Residential', 'Single-family homes, condos, townhouses, and multi-family properties up to 4 units', '{365,366,367,369,372,373,376,377,380,382,383,384,385,386,387,388,390}', 'residential', '2025-06-09 19:00:01.604155+00', '2025-06-09 19:00:01.604155+00'),
	('ba19f2eb-d665-4c18-a301-99d38dfacf79', 'Multi-Family', 'Apartment buildings with 5+ units', '{357,358,359,360,361,381}', 'multi-family', '2025-06-09 19:00:01.604155+00', '2025-06-09 19:00:01.604155+00'),
	('a177fc0b-6a92-4826-a3b4-3378356d22fb', 'Office', 'Commercial office buildings and spaces', '{136,139,140,169,170,176,177,184}', 'office', '2025-06-09 19:00:01.604155+00', '2025-06-09 19:00:01.604155+00'),
	('57514838-9417-4c3a-9697-d0e5cb05674e', 'Retail', 'Retail stores, shopping centers, and malls', '{124,125,128,130,141,143,144,145,151,158,167,178,179,183,188}', 'retail', '2025-06-09 19:00:01.604155+00', '2025-06-09 19:00:01.604155+00'),
	('d38ce251-b364-4d38-af1a-0ad634fda2dc', 'Industrial', 'Warehouses, manufacturing facilities, and distribution centers', '{195,196,197,198,199,200,201,202,203,205,206,207,208,210,211,212,213,215,216,217,218,220,221,224,225,226,227,228,231,232,238}', 'industrial', '2025-06-09 19:00:01.604155+00', '2025-06-09 19:00:01.604155+00'),
	('e1faf8e9-611d-4eaa-82a5-e4b15348e1ae', 'Land', 'Vacant land and development sites', '{102,112,117,389,392,393,394,395,396,398,399,400,401,403,404,406}', 'land', '2025-06-09 19:00:01.604155+00', '2025-06-09 19:00:01.604155+00'),
	('f606bf4f-e435-4bb2-bfcc-040866bff3d8', 'Hospitality', 'Hotels, motels, and resorts', '{131,132,153,154,155,163,273}', 'hospitality', '2025-06-09 19:00:01.604155+00', '2025-06-09 19:00:01.604155+00'),
	('9d315e89-d952-4525-80fb-49ea37732d27', 'Self Storage', 'Self-storage facilities and storage unit complexes', '{229,196,236,202,235,238,448,356}', 'self-storage', '2025-06-09 19:00:01.604155+00', '2025-06-09 19:00:01.604155+00'),
	('704b4ee4-e9e3-4011-bd63-18ffecf606a3', 'Mixed-Use', 'Properties with multiple uses (e.g., retail on ground floor, residential above)', '{140,161,171,187}', 'mixed-use', '2025-06-09 19:00:01.604155+00', '2025-06-09 19:00:01.604155+00');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "email", "full_name", "phone_number", "avatar_url", "locale", "timezone", "time_format", "created_at", "updated_at", "role", "billing_address") VALUES
	('aec53558-767e-4408-b4d6-1c1e6f17ffe5', 'user@example.com', 'Test User', NULL, NULL, 'en', NULL, 24, '2025-06-09 19:00:01.604155+00', '2025-06-09 19:00:01.604155+00', NULL, NULL),
	('f68e519a-562b-4fd3-8480-f6b18c7d7498', 'danilocoding@pm.me', 'Danilo Menezes', '+13024501590', NULL, 'en', NULL, 24, '2025-06-09 19:27:14.929848+00', '2025-06-09 19:27:14.929848+00', 'investor', NULL),
	('c09049d5-9ac2-458f-8730-c9166c4cb845', 'danilomenezes@proton.me', 'Danilo Menezes', '+13024501590', NULL, 'en', NULL, 24, '2025-06-10 13:44:19.301429+00', '2025-06-10 13:44:19.301429+00', 'investor', NULL),
	('8559d296-e234-4e40-9036-6382411a37c2', 'jace.investor@gmail.com', 'Jace Perry', '+16197641771', NULL, 'en', NULL, 24, '2025-06-10 13:49:57.547025+00', '2025-06-10 13:49:57.547025+00', 'investor', NULL);


--
-- Data for Name: asset_licenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."asset_licenses" ("id", "user_id", "asset_type_slug", "search_params", "is_active", "created_at", "updated_at") VALUES
	('47aaffbe-7606-4469-aeff-a9b79b9e3810', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', 'residential', '{"year_min": 2024, "lot_size_max": 10000, "lot_size_min": 2000, "building_size_min": 3000}', true, '2025-06-09 19:41:45.315426+00', '2025-06-09 19:41:45.315426+00'),
	('8480ffbe-8480-4469-aeff-a9b79b9e562b', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', 'self-storage', '{}', true, '2025-06-09 19:41:45.315426+00', '2025-06-09 19:41:45.315426+00'),
	('b2f06a65-64ed-4ea7-9f28-af757f0d76bf', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', 'multi-family', '{"year_min": 2023}', true, '2025-06-17 19:57:42.358973+00', '2025-06-17 19:57:42.358973+00');


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."customers" ("id", "stripe_customer_id") VALUES
	('f68e519a-562b-4fd3-8480-f6b18c7d7498', 'cus_SN7qfrx0NcpNJN'),
	('8559d296-e234-4e40-9036-6382411a37c2', 'cus_SPIUqWJsEAA6xh');


--
-- Data for Name: location_licenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."location_licenses" ("id", "asset_license_id", "location_internal_id", "location_name", "location_type", "location_formatted", "location_state", "result_count", "expires_at", "is_active", "created_at", "updated_at") VALUES
	('135e7973-a448-448f-aa30-44d63cf77d11', '47aaffbe-7606-4469-aeff-a9b79b9e3810', 'c-sc-greer', 'Greer', 'city', 'Greer, SC', 'SC', 8, '2025-07-09 19:41:39+00', true, '2025-06-09 19:41:45.402316+00', '2025-06-09 19:41:45.402316+00'),
	('b3c9d5e1-f7a2-4b8c-ad9e-8f7a6b5c4d3e', '8480ffbe-8480-4469-aeff-a9b79b9e562b', 'c-tx-canyon-lake', 'Canyon Lake', 'city', 'Canyon Lake, TX', 'TX', 8, '2025-07-09 19:41:39+00', true, '2025-06-09 19:41:45.402316+00', '2025-06-09 19:41:45.402316+00'),
	('a7b2c8d4-e5f6-4a1b-9c8d-7e6f5a4b3c2d', '8480ffbe-8480-4469-aeff-a9b79b9e562b', 'c-fl-vero-beach', 'Vero Beach', 'city', 'Vero Beach, FL', 'FL', 12, '2025-07-09 19:41:39+00', true, '2025-06-09 19:41:45.402316+00', '2025-06-09 19:41:45.402316+00'),
	('ed23ab76-fdd1-40ec-9f2d-7bef6b555434', 'b2f06a65-64ed-4ea7-9f28-af757f0d76bf', 'c-fl-vero-beach', 'Vero Beach', 'city', 'Vero Beach, FL', 'FL', 4, '2025-07-17 19:57:37+00', true, '2025-06-17 19:57:42.439026+00', '2025-06-17 19:57:42.439026+00');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."products" ("id", "active", "name", "description", "image", "metadata") VALUES
	('prod_ST7ps4ulVWH5eI', true, 'Licensing Fee', NULL, NULL, '{}'),
	('prod_ST7pp0jGvb6SIS', true, 'Residential - Greer, SC', NULL, NULL, '{}'),
	('prod_STPS5uC4Wp5yLt', true, 'Licensing Fee', NULL, NULL, '{}'),
	('prod_STPSyV9NIHoXcm', true, 'Self Storage - Vero Beach, FL', NULL, NULL, '{}'),
	('prod_SUX8eM7VaCi28P', true, 'Licensing Fee', NULL, NULL, '{}'),
	('prod_SUX8s69fjBHQ9H', true, 'Self Storage - Vero Beach, FL', NULL, NULL, '{}'),
	('prod_SW7tQP7yeFXJ3H', true, 'Licensing Fee', NULL, NULL, '{}'),
	('prod_SW7ttngUsv34Kb', true, 'Multi-Family - Vero Beach, FL', NULL, NULL, '{}');


--
-- Data for Name: prices; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."prices" ("id", "product_id", "active", "description", "unit_amount", "currency", "type", "interval", "interval_count", "trial_period_days", "metadata") VALUES
	('price_1RYBZRFrXwG87GjCIqPhDUZt', 'prod_ST7ps4ulVWH5eI', true, NULL, 800, 'usd', 'one_time', NULL, NULL, 0, NULL),
	('price_1RYBZRFrXwG87GjCvs7zxbqx', 'prod_ST7pp0jGvb6SIS', true, NULL, 400, 'usd', 'recurring', 'month', 1, 0, NULL),
	('price_1RYSdZFrXwG87GjCcddRXYvW', 'prod_STPS5uC4Wp5yLt', true, NULL, 4300, 'usd', 'one_time', NULL, NULL, 0, NULL),
	('price_1RYSdaFrXwG87GjCSgiAltZZ', 'prod_STPSyV9NIHoXcm', true, NULL, 2150, 'usd', 'recurring', 'month', 1, 0, NULL),
	('price_1RZY4RFrXwG87GjC09CeXOLw', 'prod_SUX8eM7VaCi28P', true, NULL, 4300, 'usd', 'one_time', NULL, NULL, 0, NULL),
	('price_1RZY4RFrXwG87GjCFUN5TdXZ', 'prod_SUX8s69fjBHQ9H', true, NULL, 2150, 'usd', 'recurring', 'month', 1, 0, NULL),
	('price_1Rb5dGFrXwG87GjCTPQJOUK8', 'prod_SW7tQP7yeFXJ3H', true, NULL, 400, 'usd', 'one_time', NULL, NULL, 0, NULL),
	('price_1Rb5dGFrXwG87GjCfv0YhSqg', 'prod_SW7ttngUsv34Kb', true, NULL, 200, 'usd', 'recurring', 'month', 1, 0, NULL);


--
-- Data for Name: property_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."property_records" ("id", "location_license_id", "asset_license_id", "user_id", "property_id", "address", "city", "state", "zip", "county", "street", "fips", "mail_address", "mail_city", "mail_state", "mail_zip", "mail_street", "owner1_first_name", "owner1_last_name", "owner2_first_name", "owner2_last_name", "corporate_owned", "owner_occupied", "absentee_owner", "out_of_state_absentee_owner", "property_use", "property_use_code", "property_type", "land_use", "lot_square_feet", "square_feet", "year_built", "bedrooms", "bathrooms", "stories", "rooms_count", "units_count", "last_sale_date", "last_sale_amount", "last_sale_arms_length", "prior_sale_amount", "assessed_value", "estimated_value", "price_per_square_foot", "lender_name", "last_mortgage1_amount", "loan_type_code", "adjustable_rate", "recording_date", "maturity_date_first", "open_mortgage_balance", "private_lender", "high_equity", "negative_equity", "equity_percent", "vacant", "patio", "patio_area", "pool", "pool_area", "pre_foreclosure", "reo", "judgment", "tax_lien", "tax_delinquent_year", "mls_active", "mls_cancelled", "mls_failed", "mls_has_photos", "mls_listing_price", "mls_pending", "mls_sold", "mls_days_on_market", "mls_last_sale_date", "mls_last_status_date", "mls_listing_date", "mls_sold_price", "mls_status", "mls_type", "total_properties_owned", "total_portfolio_value", "total_portfolio_equity", "total_portfolio_mortgage_balance", "portfolio_purchased_last_6_months", "portfolio_purchased_last_12_months", "years_owned", "latitude", "longitude", "listing_amount", "rent_amount", "suggested_rent", "median_income", "last_update_date", "document_type", "document_type_code", "parcel_account_number", "prior_owner_individual", "prior_owner_months_owned", "mfh_2_to_4", "mfh_5_plus", "neighborhood", "created_at", "updated_at") VALUES
	('857986e3-9dd8-437d-ae5a-7fcd1646b255', 'ed23ab76-fdd1-40ec-9f2d-7bef6b555434', 'b2f06a65-64ed-4ea7-9f28-af757f0d76bf', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '30770164', '1845 42nd Ave # 10, Vero Beach, FL 32960', 'Vero Beach', 'FL', '32960', 'Indian River County', '1845 42nd Ave # 10', '12061', 'Po Box 534, Vero Beach, FL 32961', 'Vero Beach', 'FL', '32961', 'Po Box 534', NULL, 'Lb Properties Vero Llc', NULL, NULL, true, false, true, false, 'Garden Apt, Court Apt (5+ Units)', 357, 'MFR', 'Commercial', 45302, 12300, 2023, NULL, NULL, NULL, NULL, 10, NULL, '0', NULL, '115000', 1025868, 1025868, NULL, 'Marine Bank & Trust Company', NULL, '4', false, '2021-05-11', NULL, 1000000, false, false, false, 8, false, false, NULL, false, NULL, false, false, false, NULL, NULL, false, false, false, false, NULL, false, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4, 27.63616535161202, -80.42937286352903, NULL, NULL, NULL, '45111', '2025-01-27', 'Warranty Deed', 'DTWD', NULL, true, '5', false, true, NULL, '2025-06-17 19:57:50.479104+00', '2025-06-17 19:57:50.479104+00'),
	('1d85456c-727a-4204-9a14-247508ea424f', 'ed23ab76-fdd1-40ec-9f2d-7bef6b555434', 'b2f06a65-64ed-4ea7-9f28-af757f0d76bf', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '39962215', '1055 Royal Palm Blvd, Vero Beach, FL 32960', 'Vero Beach', 'FL', '32960', 'Indian River County', '1055 Royal Palm Blvd', '12061', '2200 Sanderling Ln, Vero Beach, FL 32963', 'Vero Beach', 'FL', '32963', '2200 Sanderling Ln', NULL, 'Jacourt Properties Llc', 'James', 'Court', true, false, true, false, 'Garden Apt, Court Apt (5+ Units)', 357, 'MFR', 'Residential', 64469, 9982, 2023, NULL, NULL, NULL, NULL, 20, NULL, '0', NULL, '800000', 1230169, 1230169, NULL, 'David Bennett', NULL, 'SEL', false, '2023-08-15', '2011-10-09', 600000, false, true, false, 71, false, false, NULL, false, NULL, false, false, false, NULL, NULL, false, false, false, false, NULL, false, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '3', '2193169', '1837000', '356169', NULL, NULL, 1, 27.64167350945842, -80.39508629935231, NULL, NULL, NULL, '45111', '2025-02-26', 'Quit Claim Deed', 'DTQC', NULL, NULL, '202', false, true, '{"id": "214205", "name": "Royal Park", "type": "subdivision", "center": "POINT(-80.388852952393 27.645245682265)"}', '2025-06-17 19:57:50.479104+00', '2025-06-17 19:57:50.479104+00'),
	('1b0554bc-0371-4eef-bbde-5257e6cbb0f4', 'ed23ab76-fdd1-40ec-9f2d-7bef6b555434', 'b2f06a65-64ed-4ea7-9f28-af757f0d76bf', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '163126116', '4255 32nd Ave, Vero Beach, FL 32967', 'Vero Beach', 'FL', '32967', 'Indian River County', '4255 32nd Ave', '12061', '2525 Saint Lucie Ave, Vero Beach, FL 32960', 'Vero Beach', 'FL', '32960', '2525 Saint Lucie Ave', NULL, 'Coalition For Attainable Homes Inc', NULL, NULL, true, false, true, false, 'Apartments (Generic)', 360, 'MFR', 'Residential', 13504, 3006, 2023, NULL, NULL, NULL, NULL, 3, NULL, '0', NULL, '0', 402415, 586000, NULL, NULL, NULL, NULL, false, '2020-04-16', NULL, NULL, false, true, false, 100, false, false, NULL, false, NULL, false, false, false, NULL, NULL, false, false, false, false, NULL, false, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '33', '12570591', '12570591', '0', NULL, NULL, 5, 27.67012509347008, -80.41840543323814, NULL, NULL, NULL, '63047', '2025-06-11', 'Quit Claim Deed', 'DTQC', NULL, NULL, NULL, true, false, NULL, '2025-06-17 19:57:50.479104+00', '2025-06-17 19:57:50.479104+00'),
	('d29b94e7-8939-46b2-947a-be03a80e4bbe', 'ed23ab76-fdd1-40ec-9f2d-7bef6b555434', 'b2f06a65-64ed-4ea7-9f28-af757f0d76bf', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '700037206088', 'Vero Beach, FL 32966', 'Vero Beach', 'FL', '32966', 'Indian River County', NULL, '12061', '433 Las Colinas Blvd E Ste 300, Irving, TX 75039', 'Irving', 'TX', '75039', '433 Las Colinas Blvd E Ste 300', NULL, 'Wp Verobch Mf-Fl Owner Llc', NULL, NULL, true, false, false, false, 'Garden Apt, Court Apt (5+ Units)', 357, 'MFR', 'Multiple Garden Residence', 957884, 31605, 2023, NULL, NULL, NULL, NULL, 36, NULL, '0', true, '12475000', 4182279, 4182279, NULL, NULL, NULL, NULL, false, '2009-07-28', NULL, NULL, false, true, false, 100, false, false, NULL, false, NULL, false, false, false, NULL, NULL, false, false, false, false, NULL, false, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, 27.640768220352765, -80.48372447455958, NULL, NULL, NULL, '57851', '2025-06-02', 'Trustees Deed', 'DTTD', NULL, NULL, '34', false, true, NULL, '2025-06-17 19:57:50.479104+00', '2025-06-17 19:57:50.479104+00'),
	('b2351538-10f7-4a71-91dd-14c377451c5a', '135e7973-a448-448f-aa30-44d63cf77d11', '47aaffbe-7606-4469-aeff-a9b79b9e3810', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '1000185496', '19 Riley Eden Ln, Greer, SC 29650', 'Greer', 'SC', '29650', 'Greenville County', '19 Riley Eden Ln', '45045', '19 Riley Eden Ln, Greer, SC 29650', 'Greer', 'SC', '29650', '19 Riley Eden Ln', 'Zachary M', 'White', 'Cathryn C', 'White', false, false, false, false, 'Single Family Residence', 385, 'SFR', 'Residential', 8276, 3392, 2024, 5, 3, NULL, NULL, NULL, NULL, '507490', true, NULL, 11310, 566000, 150, 'Primelending', NULL, 'COV', false, '2024-04-05', '2054-05-01', 405992, false, false, false, 29, false, false, NULL, false, NULL, false, false, false, NULL, NULL, false, false, false, true, 522490, false, true, 664, NULL, '2024-12-12', '2023-08-15', 522490, 'Closed', 'ForSale', NULL, NULL, NULL, NULL, NULL, NULL, 1, 34.913630545740205, -82.25329582101935, NULL, NULL, NULL, '81956', '2025-05-21', 'Limited Warranty Deed', 'DTLW', '202400026018388001', NULL, NULL, false, false, NULL, '2025-06-09 19:47:49.280384+00', '2025-06-09 19:47:49.280384+00'),
	('988f5a53-e083-4597-b7e9-bb0a6ad1f5cc', '135e7973-a448-448f-aa30-44d63cf77d11', '47aaffbe-7606-4469-aeff-a9b79b9e3810', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '1000185475', '24 Riley Eden Ln, Greer, SC 29650', 'Greer', 'SC', '29650', 'Greenville County', '24 Riley Eden Ln', '45045', '24 Riley Eden Ln, Greer, SC 29650', 'Greer', 'SC', '29650', '24 Riley Eden Ln', 'Viet Anh', 'Vu', 'Phuong My', 'Phan', false, false, false, false, 'Single Family Residence', 385, 'SFR', 'Residential', 8712, 3391, 2024, 4, 2, NULL, NULL, NULL, NULL, '485000', true, NULL, 10820, 505000, 143, 'Capital City Home Llc', NULL, 'COV', false, '2024-06-12', '2054-07-01', 375000, false, false, false, 26, false, false, NULL, false, NULL, false, false, false, NULL, NULL, false, false, false, true, 509900, false, true, 825, NULL, '2024-12-12', '2023-03-07', 509900, 'Closed', 'ForSale', '2', '846000', '475210', '370790', NULL, 1, NULL, 34.91400741862301, -82.25382173346195, NULL, NULL, '1970', '81956', '2025-05-21', 'Deed', 'DTDE', '202400026017988001', NULL, NULL, false, false, NULL, '2025-06-09 19:47:49.280384+00', '2025-06-09 19:47:49.280384+00'),
	('44d61652-0d89-4198-9d20-54bedde9a8c0', '135e7973-a448-448f-aa30-44d63cf77d11', '47aaffbe-7606-4469-aeff-a9b79b9e3810', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '1000188576', '112 Leander Dr, Greer, SC 29651', 'Greer', 'SC', '29651', 'Greenville County', '112 Leander Dr', '45045', '112 Leander Dr, Greer, SC 29651', 'Greer', 'SC', '29651', '112 Leander Dr', 'Jakob Hart', 'Forthman', 'Emily Elizabeth', 'Forthman', false, false, false, false, 'Single Family Residence', 385, 'SFR', 'Other / Unknown', 7187, 3197, 2024, 3, 2, NULL, NULL, NULL, NULL, '543900', true, '1734000', 11580, 559000, 170, NULL, NULL, NULL, false, '2024-06-27', NULL, NULL, false, true, false, 100, false, false, NULL, false, NULL, false, false, false, NULL, NULL, false, false, false, true, 573900, false, true, 484, NULL, '2024-12-12', '2024-02-11', 573900, 'Closed', 'ForSale', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 34.9919643058824, -82.28698877432355, NULL, NULL, '1344', '65691', '2025-05-21', 'Deed', 'DTDE', '202400025786388001', NULL, '10', false, false, '{"id": "148411", "name": "O''Neal Village", "type": "subdivision", "center": "POINT(-82.281410292997 34.993788911631)"}', '2025-06-09 19:47:49.280384+00', '2025-06-09 19:47:49.280384+00'),
	('4800aa3c-5260-4324-86d9-b951320ca8d9', '135e7973-a448-448f-aa30-44d63cf77d11', '47aaffbe-7606-4469-aeff-a9b79b9e3810', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '1000188573', '106 Leander Dr, Greer, SC 29651', 'Greer', 'SC', '29651', 'Greenville County', '106 Leander Dr', '45045', '106 Leander Dr, Greer, SC 29651', 'Greer', 'SC', '29651', '106 Leander Dr', 'Daniel V', 'Sedder', 'Lois J', 'Sedder', false, false, false, false, 'Single Family Residence', 385, 'SFR', 'Other / Unknown', 7187, 3168, 2024, 3, 2, NULL, NULL, NULL, NULL, '554069', true, '1734000', 11440, 575000, 175, NULL, NULL, NULL, false, '2024-04-05', NULL, NULL, false, true, false, 100, false, false, NULL, false, NULL, false, false, false, NULL, NULL, false, false, false, false, NULL, false, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 34.99233998110001, -82.28659782143778, NULL, NULL, '1344', '65691', '2025-05-21', 'Deed', 'DTDE', '202400025786188001', NULL, '8', false, false, '{"id": "148411", "name": "O''Neal Village", "type": "subdivision", "center": "POINT(-82.281410292997 34.993788911631)"}', '2025-06-09 19:47:49.280384+00', '2025-06-09 19:47:49.280384+00'),
	('b009c48b-0789-427b-9d7b-25993af45886', '135e7973-a448-448f-aa30-44d63cf77d11', '47aaffbe-7606-4469-aeff-a9b79b9e3810', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '1000185479', '8 Riley Eden Ln, Greer, SC 29650', 'Greer', 'SC', '29650', 'Greenville County', '8 Riley Eden Ln', '45045', '8 Riley Eden Ln, Greer, SC 29650', 'Greer', 'SC', '29650', '8 Riley Eden Ln', 'John Gene', 'Phillips', 'Jennifer M', 'Phillips', false, false, false, false, 'Single Family Residence', 385, 'SFR', 'Residential', 6970, 3009, 2024, 4, 3, NULL, NULL, NULL, NULL, '505372', true, NULL, 15390, 537000, 168, 'Primelending', NULL, 'VA', false, '2024-04-03', '2054-05-01', 516237, false, false, false, 5, false, false, NULL, false, NULL, false, false, false, NULL, NULL, false, false, false, true, 511872, false, true, 698, NULL, '2024-12-12', '2023-07-12', 511872, 'Closed', 'ForSale', NULL, NULL, NULL, NULL, NULL, NULL, 1, 34.91428981304357, -82.25317699188626, NULL, NULL, '1970', '81956', '2025-05-21', 'Limited Warranty Deed', 'DTLW', '202400026018088001', NULL, NULL, false, false, NULL, '2025-06-09 19:47:49.280384+00', '2025-06-09 19:47:49.280384+00'),
	('62b87686-b190-4d96-8c7b-a6dbca5f7da8', '135e7973-a448-448f-aa30-44d63cf77d11', '47aaffbe-7606-4469-aeff-a9b79b9e3810', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '1000188574', '108 Leander Dr, Greer, SC 29651', 'Greer', 'SC', '29651', 'Greenville County', '108 Leander Dr', '45045', '108 Leander Dr, Greer, SC 29651', 'Greer', 'SC', '29651', '108 Leander Dr', 'Steven M', 'Larocco', 'Barbara J', 'Medina', false, false, false, false, 'Single Family Residence', 385, 'SFR', 'Other / Unknown', 7187, 3118, 2024, 3, 2, NULL, NULL, NULL, NULL, '0', NULL, '554122', 11460, 570000, NULL, NULL, NULL, NULL, false, '2025-03-03', NULL, NULL, false, true, false, 100, false, false, NULL, false, NULL, false, false, false, NULL, NULL, false, false, false, false, NULL, false, true, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 34.99221476858158, -82.28672817656889, NULL, NULL, '1344', '65691', '2025-05-21', 'Intrafamily Transfer', 'DTIT', '202400025786288001', true, '11', false, false, '{"id": "148411", "name": "O''Neal Village", "type": "subdivision", "center": "POINT(-82.281410292997 34.993788911631)"}', '2025-06-09 19:47:49.280384+00', '2025-06-09 19:47:49.280384+00'),
	('0ffacc3e-52a7-482c-9704-f4a6f3bedf85', '135e7973-a448-448f-aa30-44d63cf77d11', '47aaffbe-7606-4469-aeff-a9b79b9e3810', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '1000188577', '114 Leander Dr, Greer, SC 29651', 'Greer', 'SC', '29651', 'Greenville County', '114 Leander Dr', '45045', '114 Leander Dr, Greer, SC 29651', 'Greer', 'SC', '29651', '114 Leander Dr', 'Gregory A', 'Wiens', 'Mary Kay', 'Wiens', false, false, false, false, 'Single Family Residence', 385, 'SFR', 'Other / Unknown', 7187, 3118, 2024, 3, 2, NULL, NULL, NULL, NULL, '632450', true, '1734000', 12620, 652000, 203, NULL, NULL, NULL, false, '2024-05-17', NULL, NULL, false, true, false, 100, false, false, NULL, false, NULL, false, false, false, NULL, NULL, false, false, false, false, NULL, false, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 34.99183926970628, -82.2871191766586, NULL, NULL, '1344', '65691', '2025-05-21', 'Deed', 'DTDE', '202400025786488001', NULL, '9', false, false, '{"id": "148411", "name": "O''Neal Village", "type": "subdivision", "center": "POINT(-82.281410292997 34.993788911631)"}', '2025-06-09 19:47:49.280384+00', '2025-06-09 19:47:49.280384+00'),
	('febf9de8-344e-4a9a-8ee2-5c7af5383d04', '135e7973-a448-448f-aa30-44d63cf77d11', '47aaffbe-7606-4469-aeff-a9b79b9e3810', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', '1000188572', '104 Leander Dr, Greer, SC 29651', 'Greer', 'SC', '29651', 'Greenville County', '104 Leander Dr', '45045', '104 Leander Dr, Greer, SC 29651', 'Greer', 'SC', '29651', '104 Leander Dr', 'Suhaib', 'Khan', 'Diem Amy', 'Khan', false, false, false, false, 'Single Family Residence', 385, 'SFR', 'Residential', 7187, 3118, 2024, 3, 2, NULL, NULL, NULL, NULL, '638135', true, '1734000', 12770, 658000, 205, 'Toll Brothers Mortgage Co', NULL, 'COV', false, '2024-05-30', '2054-06-01', 574322, false, false, false, 13, false, false, NULL, false, NULL, false, false, false, NULL, NULL, false, false, false, false, NULL, false, true, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 34.992465295969374, -82.28646766524976, NULL, NULL, '1344', '65691', '2025-05-21', 'Deed', 'DTDE', '202400025786088001', NULL, '9', false, false, '{"id": "148411", "name": "O''Neal Village", "type": "subdivision", "center": "POINT(-82.281410292997 34.993788911631)"}', '2025-06-09 19:47:49.280384+00', '2025-06-09 19:47:49.280384+00');


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."subscriptions" ("id", "user_id", "status", "metadata", "price_id", "quantity", "cancel_at_period_end", "created", "current_period_start", "current_period_end", "ended_at", "cancel_at", "canceled_at", "trial_start", "trial_end") VALUES
	('sub_1RYBZgFrXwG87GjCxz4dzA39', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', 'active', '{}', 'price_1RYBZRFrXwG87GjCvs7zxbqx', 1, false, '2025-06-09 19:41:39+00', '2025-06-09 19:41:39+00', '2025-07-09 19:41:39+00', NULL, NULL, NULL, NULL, NULL),
	('sub_1Rb5dVFrXwG87GjCS3hIJ50D', 'f68e519a-562b-4fd3-8480-f6b18c7d7498', 'active', '{}', 'price_1Rb5dGFrXwG87GjCfv0YhSqg', 1, false, '2025-06-17 19:57:37+00', '2025-06-17 19:57:37+00', '2025-07-17 19:57:37+00', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('avatars', 'avatars', NULL, '2025-05-27 19:03:26.168813+00', '2025-05-27 19:03:26.168813+00', true, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 67, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;

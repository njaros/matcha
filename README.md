# matcha
dating web site 42 project 

# DOCS

- celui qui sait

# BUGS

- dans match-list, les users sont dupliques pour chaque photos qu'ils ont
- lorsqu on unlike un match avec lequel on a des message en conversation : DETAIL:  Key (id)=(71e7ad98-3148-11ef-8cdc-0242ac120003) is still referenced from table "unread_msg". => il manque des ON DELETE CASCADE a la creation de la table
- lorsqu on unlike un match, la conv apparait encore => soucis de store

# TODOS-REPORT

- dans l'action de report dans les listes du profile, faire retourner a la liste

# TODOS-VALIDATORS

- is_email

# TODOS-CHAT

- fix last message

# TODOS-SOCKET

- a la deconnection via le bouton, il faut deconnecter la socket

# ERROR_LOGS_SERVER

- TypeError: The view function for 'chat.get_unread_msg_count' did not return a valid response. The function either returned None or ended without a return statement.

# Apres rererelecture du sujet ce qu'on a pas fait:

- profile : liste de ceux qui ont like l'utilisateur
- creer des champs nom et prenom dans le user_table
- See if a user is currently online, and if not, see the date and time of their last connection.
- faire un bouton block qui remove le like + met le user dans le cancel_table

# matcha
dating web site 42 project 

# DOCS

- celui qui sait

# BUGS

- dans match-list, les users sont dupliques pour chaque photos qu'ils ont
- lorsqu on unlike un match, la conv apparait encore => soucis lorsqu il n'y a pas du tout de conv, le store ne s'update pas
- on me devrait pas pouvoir mettre de champs vide sur tout les champs de modif profile => juste need le is_email

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

- See if a user is currently online, and if not, see the date and time of their last connection.

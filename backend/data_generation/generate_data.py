from faker import Faker
from random import randint
from copy import deepcopy
#
# with open("users.sql", "w") as file:
#     fake = Faker()
#     file.write("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='passwords_user';\n")
#     for i in range(10):
#         file.write('INSERT INTO passwords_user (password, last_login, is_superuser, created_at, last_modified, username, email, is_staff, is_active, per_page, role) VALUES \n')
#         for j in range(9):
#             string = f"('pbkdf2_sha256$390000$XcpQN8wSzDbIOPFLuCTbmO$s/+mxRanzAWjuy/3ezP1EpmGxqp+RknTElE5/HfrPVM=', " \
#                      f" null,  0, '2023-05-13 16:32:30.402', '2023-05-13', '{fake.user_name()}{j}{i}', '{fake.user_name()}{j}{i}@gmail.com', 0, 1, 25, '{fake.word(ext_word_list=['admin', 'user', 'moderator'])}'),"
#             file.write(string + '\n')
#         string =  f"('pbkdf2_sha256$390000$XcpQN8wSzDbIOPFLuCTbmO$s/+mxRanzAWjuy/3ezP1EpmGxqp+RknTElE5/HfrPVM=', " \
#                      f" null,  0, '2023-05-13 16:32:30.402', '2023-05-13', '{fake.user_name()}{j}{i}', '{fake.user_name()}{j}{i}@gmail.com', 0, 1, 25, '{fake.word(ext_word_list=['admin', 'user', 'moderator'])}');"
#         file.write(string + '\n')
#
#     file.flush()
#     file.close()

# with open("vaults.sql", "w") as file:
#     fake = Faker()
#     file.write("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='passwords_vault';\n")
#     list_title_vaults = ['vault', 'work', 'university', 'websites', 'company', 'organization', 'job', 'secret', 'top-secret', 'home', 'school']
#     id_user = 1
#     for i in range(10):
#         file.write('INSERT INTO passwords_vault (user_id, title, description, master_password, created_at, last_modified) VALUES \n')
#         for j in range(9):
#             string = f"({id_user}, '{fake.sentence(nb_words=1).replace('.', '')}{randint(1, 10000)}',  " \
#                      f"'{fake.sentence(nb_words=4, variable_nb_words=True).replace('.', '')}',  '{fake.password()}', '{fake.date_time_between()}'," \
#                      f" '{fake.date_between()}'),"
#             file.write(string + '\n')
#
#             if id_user == 10000:
#                 id_user = 1
#             else:
#                 id_user += 1
#
#         string = f"({id_user}, '{fake.word(ext_word_list=list_title_vaults)}{randint(1, 10000)}',  " \
#                      f"'{fake.sentence(nb_words=4, variable_nb_words=True).replace('.', '')}',  '{fake.password()}', '{fake.date_time_between()}'," \
#                      f" '{fake.date_between()}');"
#         file.write(string + '\n')
#
#         if id_user == 10000:
#             id_user = 1
#         else:
#             id_user += 1
#
#     file.flush()
#     file.close()
#
with open("profiles.sql", "w") as file:
    fake = Faker()
    file.write("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='passwords_userprofile';\n")
    id_user = 1
    genders = ["M", "F"]
    marital_status = ["married", "divorced", "single", "relationship", "widowed"]
    for i in range(10):
        file.write('INSERT INTO passwords_userprofile (user_id, bio, gender, marital_status, birthday, instagram) VALUES \n')
        for j in range(9):
            string = f"({id_user}, '{fake.paragraph()}',  " \
                     f"'{fake.word(ext_word_list=genders)}',  '{fake.word(ext_word_list=marital_status)}', '{fake.date_between()}'," \
                     f" '{fake.user_name()}'),"
            file.write(string + '\n')

            id_user += 1

        string = f"({id_user}, '{fake.paragraph()}',  " \
                 f"'{fake.word(ext_word_list=genders)}',  '{fake.word(ext_word_list=marital_status)}', '{fake.date_between()}'," \
                 f" '{fake.user_name()}');"
        file.write(string + '\n')

        id_user += 1

    file.flush()
    file.close()
#
# with open("classics.sql", "w") as file:
#     fake = Faker()
#     file.write("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='passwords_passwordclassic';\n")
#     id_user_vault = 1
#     for i in range(10):
#         file.write('INSERT INTO passwords_passwordclassic (user_id, vault_id, created_at, last_modified, used_for, note, password) VALUES \n')
#         for j in range(9):
#             string = f"({id_user_vault}, {id_user_vault}, '{fake.date_time_between()}', '{fake.date_between()}', " \
#                      f"'{fake.sentence(nb_words=2).replace('.', '')}', " \
#                      f"'{fake.sentence(nb_words=4, variable_nb_words=True).replace('.', '')}',  '{fake.password()}'),"
#             file.write(string + '\n')
#
#             if id_user_vault == 10000:
#                 id_user_vault = 1
#             else:
#                 id_user_vault += 1
#         string = f"({id_user_vault}, {id_user_vault}, '{fake.date_time_between()}', '{fake.date_between()}', " \
#                  f"'{fake.sentence(nb_words=2).replace('.', '')}', " \
#                      f"'{fake.sentence(nb_words=4, variable_nb_words=True).replace('.', '')}',  '{fake.password()}');"
#         file.write(string + '\n')
#
#         if id_user_vault == 10000:
#             id_user_vault = 1
#         else:
#             id_user_vault += 1
#
#     file.flush()
#     file.close()

# file_tag = open("tags.sql", "w")
# file_accp = open("accounts.sql", "w")
# file_rel = open("relation.sql", "w")
# list_ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
#
# file_tag.write("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='passwords_tag';\n")
# file_accp.write("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='passwords_passwordaccount';\n")
# file_rel.write("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='passwords_tagpassword';\n")
# fake = Faker()
# id_user_vault = 1
# for i in range(10):
#     print(i)
#     for j in range(10):
#
#         file_tag.write('INSERT INTO passwords_tag (user_id, vault_id, title) VALUES \n')
#         file_accp.write('INSERT INTO passwords_passwordaccount (created_at, last_modified, user_id, vault_id, website_or_app, username_or_email, note, password) VALUES \n')
#         for k in range(10):
#             string_tag = ""
#             string_accp = ""
#
#             if k != 9:
#                 string_tag = f"({id_user_vault}, {id_user_vault},  '{fake.sentence(nb_words=2).replace('.', '')}'),"
#                 string_accp = f"('{fake.date_time_between()}', '{fake.date_between()}', {id_user_vault}, {id_user_vault},  '{fake.domain_word()}', '{fake.company_email()}', " \
#                          f"'{fake.sentence(nb_words=4, variable_nb_words=True).replace('.', '')}',  '{fake.password()}'),"
#             else:
#                 string_tag = f"({id_user_vault}, {id_user_vault},  '{fake.sentence(nb_words=2).replace('.', '')}');"
#                 string_accp = f"('{fake.date_time_between()}', '{fake.date_between()}', {id_user_vault}, {id_user_vault},  '{fake.domain_word()}', '{fake.company_email()}', " \
#                               f"'{fake.sentence(nb_words=4, variable_nb_words=True).replace('.', '')}',  '{fake.password()}');"
#
#             file_tag.write(string_tag + '\n')
#             file_accp.write(string_accp + '\n')
#
#             if id_user_vault == 10000:
#                 id_user_vault = 1
#             else:
#                 id_user_vault += 1
#
#         file_rel.write('INSERT INTO passwords_tagpassword (created_at, description, tag_id, password_id) VALUES \n')
#
#         for index_tag in range(10):
#             for index_accp in range(10):
#                 string_rel = ""
#                 if index_tag == 9 and index_accp == 9:
#                     string_rel = f"('{fake.date_time_between()}', '{fake.sentence(nb_words=2, variable_nb_words=True).replace('.', '')}', {list_ids[index_tag]}, {list_ids[index_accp]});"
#                 else:
#                     string_rel = f"('{fake.date_time_between()}', '{fake.sentence(nb_words=2, variable_nb_words=True).replace('.', '')}', {list_ids[index_tag]}, {list_ids[index_accp]}),"
#                 file_rel.write(string_rel + '\n')
#
#         list_ids = deepcopy([x + 10 for x in list_ids])
#
#
# file_tag.flush()
# file_accp.flush()
# file_rel.flush()
# file_tag.close()
# file_accp.close()
# file_rel.close()





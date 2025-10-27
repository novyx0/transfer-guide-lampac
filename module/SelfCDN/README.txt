1. To enable search by title, you need to make the following change in init.conf:

"online": {
    "appReplace": {
      "var\\s+balansers_with_search\\s*=\\s*\\[": "var balansers_with_search = [\"selfcdn\","
    }
}
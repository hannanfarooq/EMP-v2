# MORE-ME-API
```
git clone https://github.com/devawais98/more-me-backend.git <folder-name>
```

>now copy **.env.local** file to **.env** file

### Installing
```
npm install
```

### Database Config Setup
```
DB_HOST=localhost               # database connection host
DB_USER=dev                    # database username
DB_PASS=postgres              # database password
DB_NAME=express-sequelize-api   # database name
DB_DIALECT=postgres             # database dialect
DB_PORT=5432                    # database port
```
some other inportant parameters/keys in **.env** file
```
APP_HOST=localhost      # application host name
APP_PORT=3000           # application port
SECRET=secret           # secret key for encrypt/decrypt JWT token
```

### Migration and Seeders run
After creating database and updating .env file run below commands
```
> npm run db:migrate
> npm run db:seed:all
```

`npm start` to run your project 
>Everythig is setup and you are good to go now. Happy Coding :)

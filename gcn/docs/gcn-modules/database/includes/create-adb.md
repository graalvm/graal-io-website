1. In the Oracle Cloud Console, open the navigation menu, click **Oracle Database**. Under **Autonomous Database**, click **Autonomous Transaction Processing**.

2. Click **Create Autonomous Database** and accept the default name for the database.

3. Select **Transaction Processing** and **Serverless**. If you are using a trial account, make sure you select **Always Free**.

4. Create an admin password (must be at least 12 characters and contain a number and an uppercase letter) and select **Secure access from everywhere** as the network access type.

5. Click **Create Autonomous Database** to create your database.

6. On the **Autonomous Database Details** screen click **Copy** to copy the OCID of the database. (This is a unique identifier which you will need later.)

### 2.1. Create a User

1. When the database has been provisioned, on the **Autonomous Database Details** page, click **Database Actions**. (If necessary, log in with username "ADMIN" and the admin password you created earlier.)

2. Click **SQL** to open the SQL console.

3. Copy and paste the following SQL commands into the worksheet:

    ```sql
    CREATE USER gcn_user IDENTIFIED BY "XXXXXXXXX";
    GRANT CONNECT, RESOURCE TO gcn_user;
    GRANT UNLIMITED TABLESPACE TO gcn_user;
    ```

    Create a schema user password (must be at least 12 characters and contain a number and an uppercase letter) and replace the text "XXXXXXXXX" with that password.

4. Click **Run Script** to run the SQL commands.

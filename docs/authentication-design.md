# Authentication Design

Each entity authenticates independently. The login flow is:

- Enter the password for the target entity.
- Verify the password.
- On success, issue an access token (JWT) signed by the server and containing
  the entity ID.
- For each permissioned operation, validate the JWT from the HTTP cookie and
  check that it authorizes access to the requested resource.

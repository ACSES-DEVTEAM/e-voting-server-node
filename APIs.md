## APIs

### Users

- POST `/api/users/login` - Login
- POST `/api/users/signup` - Signup
- GET `/api/users/getUsers` - Get all users
- GET `/api/users/getDepartmentUsers` - Get sum of users from department
- GET `/api/users/getUsersFullInfo` - Get all users full information
- GET `/api/users/getUser/:id` - Get user by id
- DELETE `/api/users/deleteUser/:id` - Delete user by id
- PUT `/api/users/updateUser/:id` - Update user by id

### Candidates

- POST `/api/candidates/signup` - Signup
- GET `/api/candidates/getCandidates` - Get all candidates
- GET `/api/candidates/getCandidate/` - Get candidate by indexNumber
- DELETE `/api/candidates/deleteCandidate/:id` - Delete candidate by id
- PUT `/api/candidates/updateCandidate/:id` - Update candidate by id

### Votes

- GET `/api/votes/getVotes` - Get all votes
- POST `/api/votes/addVote` - Add vote
- POST `/api/votes/resetVote` - Reset all votes
- GET `/api/votes/getTotalVotes` - Get total votes


### Admin

- POST `/api/admin/updateSiteMode` - Update the site mode
- GET `/api/admin/getSiteMode` - Get the site mode

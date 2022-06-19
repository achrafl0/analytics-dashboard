install:
	cd backend && npm install
	cd frontend && npm install

run:
	cd backend && node ./mock-backend.js
	cd frontend && npm run start

	

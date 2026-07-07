async function run() {
	try {
		const timestamp = Date.now();
		const customerEmail = `customer.${timestamp}@example.com`;
		const contractorEmail = `contractor.${timestamp}@example.com`;

		console.log('--- STEP 1: Register and Login Customer ---');
		const custRegRes = await fetch('http://localhost:8080/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				firstName: 'Jane',
				lastName: 'Customer',
				email: customerEmail,
				password: 'password123',
				roleName: 'CUSTOMER'
			})
		});
		const custRegData = await custRegRes.json();
		console.log('Customer Registration Status:', custRegRes.status);
		if (!custRegData.success) {
			throw new Error(`Customer Registration failed: ${JSON.stringify(custRegData)}`);
		}
		const customerToken = custRegData.data.accessToken;

		console.log('--- STEP 2: Register and Login Contractor ---');
		const contrRegRes = await fetch('http://localhost:8080/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				firstName: 'Bob',
				lastName: 'Contractor',
				email: contractorEmail,
				password: 'password123',
				roleName: 'CONTRACTOR'
			})
		});
		const contrRegData = await contrRegRes.json();
		console.log('Contractor Registration Status:', contrRegRes.status);
		if (!contrRegData.success) {
			throw new Error(`Contractor Registration failed: ${JSON.stringify(contrRegData)}`);
		}
		const contractorToken = contrRegData.data.accessToken;

		// Create Contractor Profile (necessary for some setups, let's do it just in case)
		console.log('Creating Contractor Profile...');
		const profileRes = await fetch('http://localhost:8080/api/contractor/profile', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${contractorToken}`
			},
			body: JSON.stringify({
				companyName: 'Lead Hunter LLC',
				ownerName: 'Bob Contractor',
				phoneNumber: '+1234567890',
				experienceYears: 7,
				specialization: 'Carpentry',
				serviceAreas: 'Area B',
				description: 'Specialize in cabinets'
			})
		});
		console.log('Profile Creation Status:', profileRes.status);

		console.log('--- STEP 3: Create Requirements as Customer ---');
		const req1Res = await fetch('http://localhost:8080/api/requirements', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${customerToken}`
			},
			body: JSON.stringify({
				title: 'Kitchen Cabinet Repair',
				description: 'Fix the broken cabinet doors in the kitchen.',
				serviceCategory: 'Carpentry',
				location: '123 Main St, Springfield',
				budgetMin: 500.00,
				budgetMax: 1000.00,
				preferredStartDate: '2026-07-01'
			})
		});
		console.log('Requirement 1 Creation Status:', req1Res.status);
		const req1Data = await req1Res.json();
		console.log('Requirement 1 Details:', JSON.stringify(req1Data));

		// Sleep briefly to ensure distinct timestamps
		await new Promise(resolve => setTimeout(resolve, 1000));

		const req2Res = await fetch('http://localhost:8080/api/requirements', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${customerToken}`
			},
			body: JSON.stringify({
				title: 'Living Room Painting',
				description: 'Paint the walls and ceiling of the living room.',
				serviceCategory: 'Painting',
				location: '123 Main St, Springfield',
				budgetMin: 800.00,
				budgetMax: 1500.00,
				preferredStartDate: '2026-07-10'
			})
		});
		console.log('Requirement 2 Creation Status:', req2Res.status);
		const req2Data = await req2Res.json();
		console.log('Requirement 2 Details:', JSON.stringify(req2Data));

		console.log('--- STEP 4: Fetch Leads as Contractor ---');
		const leadsRes = await fetch('http://localhost:8080/api/leads', {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${contractorToken}`
			}
		});
		console.log('Leads Fetch Status:', leadsRes.status);
		const leadsData = await leadsRes.json();
		console.log('Leads Data:', JSON.stringify(leadsData, null, 2));

		if (leadsRes.status === 200 && leadsData.success) {
			const leads = leadsData.data;
			console.log(`Successfully fetched ${leads.length} leads.`);
			if (leads.length >= 2) {
				const lead1 = leads[0];
				const lead2 = leads[1];
				console.log('Lead 1 (Newest):', lead1.title);
				console.log('Lead 2 (Older):', lead2.title);
				// Living Room Painting should be lead1 (newer), Kitchen Cabinet Repair should be lead2 (older)
				if (lead1.title === 'Living Room Painting' && lead2.title === 'Kitchen Cabinet Repair') {
					console.log('VERIFICATION PASSED: Leads are sorted newest first!');
				} else {
					console.log('VERIFICATION FAILED: Leads sorting order incorrect or missing leads.');
				}
				
				// Verify privacy
				const hasCustomerDetails = Object.keys(lead1).some(key => 
					key.toLowerCase().includes('customer') || 
					key.toLowerCase().includes('name') || 
					key.toLowerCase().includes('email') || 
					key.toLowerCase().includes('phone')
				);
				
				if (!hasCustomerDetails && !lead1.customer && !lead1.email && !lead1.phone) {
					console.log('VERIFICATION PASSED: No customer personal details leaked in Lead Response.');
				} else {
					console.log('VERIFICATION FAILED: Customer details might be leaked!');
				}
			} else {
				console.log('VERIFICATION FAILED: Not enough leads found.');
			}
		}

		console.log('--- STEP 5: Verify Security (Unauthorized Access) ---');
		// Try fetching leads as Customer
		const custLeadsRes = await fetch('http://localhost:8080/api/leads', {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${customerToken}`
			}
		});
		console.log('Customer Leads Fetch Status (Expected 403):', custLeadsRes.status);
		if (custLeadsRes.status === 403) {
			console.log('VERIFICATION PASSED: Customer access to GET /api/leads is correctly forbidden.');
		} else {
			console.log('VERIFICATION FAILED: Customer access not blocked.');
		}

	} catch (err) {
		console.error('Error during test:', err);
	}
}
run();

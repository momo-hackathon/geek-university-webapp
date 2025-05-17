"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import geekCourseMarketAbi from '@/abis/geekCourseMarket.json';
import geekTokenAbi from '@/abis/geekToken.json';

const GEEK_COURSE_MARKET_ADDRESS: string = '0xb8183861ec46D734B52cb1b15642FA1F0eAd956D';
const GEEK_TOKEN_ADDRESS: string = '0x0ec34267121eaBeec3E30A6cAcFba3Ea782807B1';

export default function TestContractPage() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  const [courseMarketContract, setCourseMarketContract] = useState<ethers.Contract | null>(null);
  const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);

  // Form states for addCourse
  const [web2CourseIdAdd, setWeb2CourseIdAdd] = useState<string>('');
  const [courseNameAdd, setCourseNameAdd] = useState<string>('');
  const [coursePriceAdd, setCoursePriceAdd] = useState<string>(''); // Price in Geek

  // Form states for purchaseCourse
  const [web2CourseIdPurchase, setWeb2CourseIdPurchase] = useState<string>('');

  // Form states for buying Geek tokens
  const [ethToSpend, setEthToSpend] = useState<string>('');
  const [tokensPerEthRate, setTokensPerEthRate] = useState<bigint | null>(null);
  const [geekTokenDecimals, setGeekTokenDecimals] = useState<number | null>(null);

  // Form states for updateCourse
  const [oldWeb2CourseIdUpdate, setOldWeb2CourseIdUpdate] = useState<string>('');
  const [newWeb2CourseIdUpdate, setNewWeb2CourseIdUpdate] = useState<string>('');
  const [courseNameUpdate, setCourseNameUpdate] = useState<string>('');
  const [coursePriceUpdate, setCoursePriceUpdate] = useState<string>('');
  const [courseIsActiveUpdate, setCourseIsActiveUpdate] = useState<boolean>(true);

  // State for storing all courses
  const [allCourses, setAllCourses] = useState<any[]>([]);

  useEffect(() => {
    if (account && signer && GEEK_COURSE_MARKET_ADDRESS !== 'YOUR_GEEK_COURSE_MARKET_CONTRACT_ADDRESS' && GEEK_TOKEN_ADDRESS !== 'YOUR_GEEK_TOKEN_CONTRACT_ADDRESS') {
      try {
        const marketContract = new ethers.Contract(GEEK_COURSE_MARKET_ADDRESS, geekCourseMarketAbi.abi, signer);
        setCourseMarketContract(marketContract);
        const tkContract = new ethers.Contract(GEEK_TOKEN_ADDRESS, geekTokenAbi.abi, signer);
        setTokenContract(tkContract);
        setMessage('Contracts initialized. Ready to interact.');

        const loadAllCourses = async (currentDecimals: number) => {
          if (!marketContract) return;
          try {
            setMessage('Loading all courses...');
            const countBigInt = await marketContract.courseCount();
            const count = Number(countBigInt);
            const fetchedCourses = [];
            if (count === 0) {
              setMessage('No courses found in the market contract.');
              setAllCourses([]);
              return;
            }
            for (let i = 1; i <= count; i++) {
              try {
                const course = await marketContract.courses(BigInt(i));
                // Ensure all expected fields are present, providing defaults if necessary
                fetchedCourses.push({
                  id: BigInt(i).toString(), // Add an ID for React keys
                  web2CourseId: course.web2CourseId || 'N/A',
                  name: course.name || 'N/A',
                  price: course.price !== undefined ? course.price : BigInt(0),
                  isActive: course.isActive !== undefined ? course.isActive : false,
                  creator: course.creator || 'N/A',
                });
              } catch (courseError: any) {
                console.error(`Error fetching course with ID ${i}:`, courseError);
                // Optionally add a placeholder or skip the course
              }
            }
            setAllCourses(fetchedCourses);
            setMessage(fetchedCourses.length > 0 ? 'Courses loaded.' : 'No courses found or all failed to load.');
          } catch (e: any) {
            setMessage(`Error loading courses: ${e.message}`);
            console.error("Error loading courses:", e);
            setAllCourses([]); // Clear courses on error
          }
        };

        // Fetch TOKENS_PER_ETH and decimals from GeekToken contract
        const fetchTokenDataAndCourses = async () => {
          if (tkContract) {
            try {
              const rate = await tkContract.TOKENS_PER_ETH();
              setTokensPerEthRate(rate);
              const decimalsBigInt = await tkContract.decimals();
              const decimals = Number(decimalsBigInt);
              setGeekTokenDecimals(decimals);
              // Now that decimals are available, load courses
              if (marketContract) { // Ensure marketContract is also available
                await loadAllCourses(decimals);
              } else {
                setMessage("Course market contract not ready for loading courses.");
              }
            } catch (e: any) {
              setMessage(`Error fetching token data (rate/decimals): ${e.message}`);
              console.error("Error fetching token data:", e);
               // Attempt to load courses even if token data fails, using a default decimal for display
              if (marketContract) {
                await loadAllCourses(geekTokenDecimals !== null ? geekTokenDecimals : 18);
              }
            }
          }
        };
        fetchTokenDataAndCourses();

      } catch (e: any) {
        setMessage(`Error initializing contracts: ${e.message}. Check console and contract addresses.`);
        console.error("Contract initialization error:", e);
      }
    } else if (account && (GEEK_COURSE_MARKET_ADDRESS === 'YOUR_GEEK_COURSE_MARKET_CONTRACT_ADDRESS' || GEEK_TOKEN_ADDRESS === 'YOUR_GEEK_TOKEN_CONTRACT_ADDRESS')) {
      setMessage("Please replace placeholder contract addresses in the code.");
    }
  }, [account, signer]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setMessage("Connecting to wallet...");
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);
        const accounts = await web3Provider.send('eth_requestAccounts', []);
        if (accounts.length > 0) {
          const currentSigner = await web3Provider.getSigner();
          setSigner(currentSigner);
          setAccount(accounts[0]);
          setMessage(`Wallet connected: ${accounts[0]}`);
        } else {
          setMessage('No accounts found. Please ensure your wallet is unlocked and has accounts.');
        }
      } catch (error: any) {
        setMessage(`Error connecting wallet: ${error.message}`);
        console.error(error);
      }
    } else {
      setMessage('MetaMask (or other Ethereum wallet) not detected. Please install it.');
    }
  };

  const handleAddCourse = async () => {
    if (!courseMarketContract || !signer) {
      setMessage('Please connect wallet and ensure contracts are initialized (and addresses are correct).');
      return;
    }
    // Add this check to ensure geekTokenDecimals is loaded
    if (geekTokenDecimals === null) {
      setMessage('Token information (decimals) is still loading. Please wait a moment and try again.');
      console.log('handleAddCourse: geekTokenDecimals is null, aborting.');
      return;
    }
    if (!web2CourseIdAdd || !courseNameAdd || !coursePriceAdd) {
      setMessage('Please fill all fields for adding a course.');
      return;
    }
    if (isNaN(parseFloat(coursePriceAdd)) || parseFloat(coursePriceAdd) <= 0) {
      setMessage('Invalid course price. Must be a positive number.');
      return;
    }
    setMessage('Adding course...');
    try {
      // Directly use the fetched geekTokenDecimals.
      // If geekTokenDecimals is 0 and coursePriceAdd is "180", priceInWei will be 180n.
      const priceInWei = ethers.parseUnits(coursePriceAdd, geekTokenDecimals);
      console.log(`Adding course: ID=${web2CourseIdAdd}, Name=${courseNameAdd}, PriceInput=${coursePriceAdd}, DecimalsUsed=${geekTokenDecimals}, PriceInWei=${priceInWei.toString()}`);
      const tx = await courseMarketContract.addCourse(web2CourseIdAdd, courseNameAdd, priceInWei);
      setMessage('Transaction sent. Waiting for confirmation...');
      await tx.wait();
      setMessage(`Course "${courseNameAdd}" added successfully! Tx: ${tx.hash}`);
      setWeb2CourseIdAdd('');
      setCourseNameAdd('');
      setCoursePriceAdd('');
    } catch (error: any) {
      setMessage(`Error adding course: ${error.message}. Check console for details.`);
      console.error(error);
    }
  };

  const handleUpdateCourse = async () => {
    if (!courseMarketContract || !signer) {
      setMessage('Please connect wallet and ensure contracts are initialized.');
      return;
    }
    if (geekTokenDecimals === null) {
      setMessage('Token information (decimals) is still loading. Please wait a moment and try again.');
      console.log('handleUpdateCourse: geekTokenDecimals is null, aborting.');
      return;
    }
    if (!oldWeb2CourseIdUpdate || !newWeb2CourseIdUpdate || !courseNameUpdate || !coursePriceUpdate) {
      setMessage('Please fill all fields for updating a course.');
      return;
    }
    if (isNaN(parseFloat(coursePriceUpdate)) || parseFloat(coursePriceUpdate) <= 0) {
      setMessage('Invalid new course price. Must be a positive number.');
      return;
    }
    setMessage('Updating course...');
    try {
      const priceInWei = ethers.parseUnits(coursePriceUpdate, geekTokenDecimals);
      console.log(`Updating course: OldID=${oldWeb2CourseIdUpdate}, NewID=${newWeb2CourseIdUpdate}, Name=${courseNameUpdate}, PriceInput=${coursePriceUpdate}, DecimalsUsed=${geekTokenDecimals}, PriceInWei=${priceInWei.toString()}, IsActive=${courseIsActiveUpdate}`);
      
      const tx = await courseMarketContract.updateCourse(
        oldWeb2CourseIdUpdate,
        newWeb2CourseIdUpdate,
        courseNameUpdate,
        priceInWei,
        courseIsActiveUpdate
      );
      setMessage('Update course transaction sent. Waiting for confirmation...');
      await tx.wait();
      setMessage(`Course with old ID "${oldWeb2CourseIdUpdate}" updated successfully to new ID "${newWeb2CourseIdUpdate}"! Tx: ${tx.hash}`);
      // Clear form fields
      setOldWeb2CourseIdUpdate('');
      setNewWeb2CourseIdUpdate('');
      setCourseNameUpdate('');
      setCoursePriceUpdate('');
      setCourseIsActiveUpdate(true);
    } catch (error: any) {
      setMessage(`Error updating course: ${error.message}. Check console for details.`);
      console.error("Update course error:", error);
    }
  };

  const handlePurchaseCourse = async () => {
    if (!courseMarketContract || !tokenContract || !signer || !account) {
      setMessage('Please connect wallet and ensure contracts are initialized (and addresses are correct).');
      return;
    }
    if (!web2CourseIdPurchase) {
      setMessage('Please enter the Web2 Course ID to purchase.');
      return;
    }
    setMessage(`Processing purchase for course "${web2CourseIdPurchase}"...`);
    try {
      setMessage('Fetching course details...');
      const courseId = await courseMarketContract.web2ToCourseId(web2CourseIdPurchase);

      if (courseId.toString() === '0') { 
        setMessage(`Course with Web2 ID "${web2CourseIdPurchase}" not found or ID is invalid (possibly 0).`);
        return;
      }

      const courseDetails = await courseMarketContract.courses(courseId);
      const coursePrice = courseDetails.price; // This is a BigInt (uint256)
      const courseName = courseDetails.name;

      if (!courseDetails.isActive) {
        setMessage(`Course "${courseName}" (ID: ${web2CourseIdPurchase}) is not active.`);
        return;
      }

      const currentGeekTokenDecimals = geekTokenDecimals !== null ? geekTokenDecimals : 18; 

      // Check user's Geek token balance
      setMessage('Checking your Geek token balance...');
      const balance = await tokenContract.balanceOf(account);
      const formattedBalance = ethers.formatUnits(balance, currentGeekTokenDecimals);
      const formattedCoursePrice = ethers.formatUnits(coursePrice, currentGeekTokenDecimals);

      if (balance < coursePrice) {
        setMessage(`Insufficient Geek token balance. You have ${formattedBalance} Geek, but the course costs ${formattedCoursePrice} Geek.`);
        console.log(`Balance check failed: User has ${balance.toString()} (formatted: ${formattedBalance}), needs ${coursePrice.toString()} (formatted: ${formattedCoursePrice})`);
        return;
      }
      setMessage(`Your balance is ${formattedBalance} Geek. Course: "${courseName}", Price: ${formattedCoursePrice} Geek. Attempting to approve tokens...`);
      
      console.log("Attempting to approve GEEK_COURSE_MARKET_ADDRESS:", GEEK_COURSE_MARKET_ADDRESS, "for amount:", coursePrice.toString());

      try {
        const approveTx = await tokenContract.approve(GEEK_COURSE_MARKET_ADDRESS, coursePrice);
        setMessage('Approval transaction sent. Waiting for confirmation...');
        console.log("Approval transaction sent:", approveTx.hash);
        await approveTx.wait();
        setMessage('Approval successful. Proceeding with purchase...');
        console.log("Approval transaction confirmed.");
      } catch (approveError: any) {
        setMessage(`Error during token approval: ${approveError.message}. Check console for details. Is GEEK_TOKEN_ADDRESS (${GEEK_TOKEN_ADDRESS}) correct and does the connected account have sufficient balance and permissions?`);
        console.error("Token approval error:", approveError);
        return; // Stop if approval fails
      }

      try {
        setMessage('Attempting to purchase course...');
        console.log("Attempting to call purchaseCourse with web2CourseIdPurchase:", web2CourseIdPurchase);
        const purchaseTx = await courseMarketContract.purchaseCourse(web2CourseIdPurchase);
        setMessage('Purchase transaction sent. Waiting for confirmation...');
        console.log("Purchase transaction sent:", purchaseTx.hash);
        await purchaseTx.wait();
        setMessage(`Course "${courseName}" (ID: ${web2CourseIdPurchase}) purchased successfully! Tx: ${purchaseTx.hash}`);
        console.log("Purchase transaction confirmed.");
        setWeb2CourseIdPurchase('');
      } catch (purchaseError: any) {
        setMessage(`Error during course purchase: ${purchaseError.message}. Check console for details. Is GEEK_COURSE_MARKET_ADDRESS (${GEEK_COURSE_MARKET_ADDRESS}) correct?`);
        console.error("Course purchase error:", purchaseError);
        return; // Stop if purchase fails
      }

    } catch (error: any) { // General catch block for issues like fetching course details
      setMessage(`Error purchasing course: ${error.message}. Check console for details.`);
      console.error("Generic purchase error:", error);
    }
  };

  const handleBuyGeekTokens = async () => {
    if (!tokenContract || !signer || !account) {
      setMessage('Please connect wallet and ensure token contract is initialized.');
      return;
    }
    if (!ethToSpend || isNaN(parseFloat(ethToSpend)) || parseFloat(ethToSpend) <= 0) {
      setMessage('Please enter a valid amount of ETH to spend.');
      return;
    }
    setMessage('Processing Geek token purchase...');
    try {
      const ethValue = ethers.parseEther(ethToSpend);
      const tx = await tokenContract.buyWithETH({ value: ethValue });
      setMessage('Transaction sent for buying Geek tokens. Waiting for confirmation...');
      await tx.wait();
      setMessage(`Successfully bought Geek tokens! Tx: ${tx.hash}`);
      setEthToSpend('');
    } catch (error: any) {
      setMessage(`Error buying Geek tokens: ${error.message}. Check console for details.`);
      console.error(error);
    }
  };

  // Basic styling (can be moved to a CSS file or use Tailwind if preferred)
  const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: 'auto', background: '#f9f9f9', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
    heading: { textAlign: 'center' as 'center', color: '#333' },
    button: { padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', margin: '5px 0' },
    input: { display: 'block', width: 'calc(100% - 22px)', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' },
    section: { marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' },
    messageBox: { border: '1px solid #ccc', padding: '15px', marginTop: '20px', borderRadius: '4px', whiteSpace: 'pre-wrap' as 'pre-wrap', wordBreak: 'break-all' as 'break-all' },
    connectedStatus: { textAlign: 'center' as 'center', marginBottom: '20px', color: '#555' }
  };
  
  const getMessageStyle = () => {
    if (!message) return styles.messageBox;
    const isError = message.toLowerCase().includes('error') || message.toLowerCase().includes('failed') || message.toLowerCase().includes('rejected');
    return { ...styles.messageBox, borderColor: isError ? 'red' : 'green', color: isError ? 'red' : 'green' };
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Geek University Contract Test Page</h1>
      
      {!account ? (
        <button onClick={connectWallet} style={{...styles.button, display: 'block', margin: '20px auto'}}>Connect Wallet</button>
      ) : (
        <div style={styles.connectedStatus}>
          <p><strong>Connected Account:</strong> {account}</p>
          <p><strong>Course Market:</strong> {GEEK_COURSE_MARKET_ADDRESS === 'YOUR_GEEK_COURSE_MARKET_CONTRACT_ADDRESS' ? <span style={{color: 'red'}}>Set Address!</span> : GEEK_COURSE_MARKET_ADDRESS}</p>
          <p><strong>Geek Token:</strong> {GEEK_TOKEN_ADDRESS === 'YOUR_GEEK_TOKEN_CONTRACT_ADDRESS' ? <span style={{color: 'red'}}>Set Address!</span> : GEEK_TOKEN_ADDRESS}</p>
        </div>
      )}

      {message && (
        <div style={getMessageStyle()}>
          <strong>Status:</strong> {message}
        </div>
      )}

      {account && GEEK_COURSE_MARKET_ADDRESS !== 'YOUR_GEEK_COURSE_MARKET_CONTRACT_ADDRESS' && GEEK_TOKEN_ADDRESS !== 'YOUR_GEEK_TOKEN_CONTRACT_ADDRESS' && (
        <>
          <div style={styles.section}>
            <h2>Add Course (Owner/Admin Only)</h2>
            <input type="text" placeholder="Web2 Course ID (e.g., 'CS101')" value={web2CourseIdAdd} onChange={(e) => setWeb2CourseIdAdd(e.target.value)} style={styles.input} />
            <input type="text" placeholder="Course Name (e.g., 'Intro to CS')" value={courseNameAdd} onChange={(e) => setCourseNameAdd(e.target.value)} style={styles.input} />
            <input type="text" placeholder="Price (in Geek, e.g., '100')" value={coursePriceAdd} onChange={(e) => setCoursePriceAdd(e.target.value)} style={styles.input} />
            <button onClick={handleAddCourse} style={styles.button}>Add Course</button>
          </div>

          <div style={styles.section}>
            <h2>Update Course (Owner/Admin Only)</h2>
            <input type="text" placeholder="Old Web2 Course ID (to find the course)" value={oldWeb2CourseIdUpdate} onChange={(e) => setOldWeb2CourseIdUpdate(e.target.value)} style={styles.input} />
            <input type="text" placeholder="New Web2 Course ID" value={newWeb2CourseIdUpdate} onChange={(e) => setNewWeb2CourseIdUpdate(e.target.value)} style={styles.input} />
            <input type="text" placeholder="New Course Name" value={courseNameUpdate} onChange={(e) => setCourseNameUpdate(e.target.value)} style={styles.input} />
            <input type="text" placeholder="New Price (in Geek)" value={coursePriceUpdate} onChange={(e) => setCoursePriceUpdate(e.target.value)} style={styles.input} />
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="isActiveUpdate" style={{ marginRight: '10px' }}>Is Active?</label>
              <input 
                type="checkbox" 
                id="isActiveUpdate" 
                checked={courseIsActiveUpdate} 
                onChange={(e) => setCourseIsActiveUpdate(e.target.checked)} 
              />
            </div>
            <button onClick={handleUpdateCourse} style={styles.button}>Update Course</button>
          </div>

          <div style={styles.section}>
            <h2>All Courses in Market</h2>
            {allCourses.length === 0 && <p>No courses listed or still loading...</p>}
            {allCourses.map((course, index) => (
              <div key={course.id || index} style={{ border: '1px solid #000', padding: '10px', marginBottom: '10px', borderRadius: '4px', color: '#333' }}>
                <p><strong>Internal ID:</strong> {course.id}</p>
                <p><strong>Web2 Course ID:</strong> {course.web2CourseId}</p>
                <p><strong>Name:</strong> {course.name}</p>
                <p>
                  <strong>Price:</strong> 
                  {geekTokenDecimals !== null ? 
                    `${ethers.formatUnits(course.price, geekTokenDecimals)} Geek` : 
                    `${ethers.formatUnits(course.price, 18)} Geek (defaulting to 18 decimals for display)`}
                </p>
                <p><strong>Is Active:</strong> {course.isActive ? 'Yes' : 'No'}</p>
                <p><strong>Creator:</strong> {course.creator}</p>
              </div>
            ))}
            {allCourses.length > 0 && geekTokenDecimals === null && <p style={{color: 'orange'}}>Token decimals not loaded yet, price display might be using default.</p>}
          </div>

          <div style={styles.section}>
            <h2>Purchase Course</h2>
            <input type="text" placeholder="Web2 Course ID (e.g., 'CS101')" value={web2CourseIdPurchase} onChange={(e) => setWeb2CourseIdPurchase(e.target.value)} style={styles.input} />
            <button onClick={handlePurchaseCourse} style={styles.button}>Purchase Course</button>
          </div>

          <div style={styles.section}>
            <h2>Buy Geek Tokens with ETH</h2>
            {tokensPerEthRate !== null && geekTokenDecimals !== null ? (
              <p>Contract Rate: 1 ETH = {ethers.formatUnits(tokensPerEthRate, 0)} Geek</p> // Assuming TOKENS_PER_ETH is already in base units of Geek
            ) : (
              <p>Fetching contract exchange rate...</p>
            )}
            <p>Reference Rate: 1 ETH = 1000 Geek</p>
            <input 
              type="text" 
              placeholder="Amount of ETH to spend (e.g., '0.1')" 
              value={ethToSpend} 
              onChange={(e) => setEthToSpend(e.target.value)} 
              style={styles.input} 
            />
            {ethToSpend && !isNaN(parseFloat(ethToSpend)) && tokensPerEthRate !== null && geekTokenDecimals !== null && parseFloat(ethToSpend) > 0 && (
              <p>
                You will receive approximately: 
                {ethers.formatUnits( (ethers.parseEther(ethToSpend) * tokensPerEthRate) / ethers.parseUnits('1', 'ether') , geekTokenDecimals)} Geek
              </p>
            )}
            <button onClick={handleBuyGeekTokens} style={styles.button}>Buy Geek Tokens</button>
          </div>
        </>
      )}
    </div>
  );
}


import { useState, useEffect, useCallback } from 'react';
import { 
  useAccount, 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt, 
  usePublicClient,
  useConfig
} from 'wagmi';
import GEEK_COURSE_MARKET_ABI_FULL from '../abis/geekCourseMarket.json';

const imageUrlLists = ['https://iihe.lk/wp-content/uploads/2024/12/Blockchain-1-1024x614-1.webp', 'https://www.coinsclone.com/wp-content/uploads/2023/08/DeFi-Smart-Contract-Development-Company-856x467.png', 'https://thepaymentsassociation.org/wp-content/uploads/sites/7/2023/09/DEFI.png', 'https://www.whataportrait.com/media/wordpress/5f3cfbe5e12c6e5d1d323934b8f68676.jpg', 'https://www.wedigraf.com/wp-content/uploads/2025/02/web3-certification-trainin-at-wedigraf-tech-hub-port-harcourt-and-uyo-nigeria-2048x1152.jpg', 'https://www.consultia.co/wp-content/uploads/2024/04/IMG_0595.webp']

// 使用 ABI 文件中的 abi 数组
const geekCourseMarketABI = GEEK_COURSE_MARKET_ABI_FULL.abi;

// 替换为你的实际合约地址或通过环境变量配置
const GEEK_COURSE_MARKET_ADDRESS = (process.env.NEXT_PUBLIC_GEEK_COURSE_MARKET_ADDRESS || '0xb8183861ec46D734B52cb1b15642FA1F0eAd956D') as `0x${string}`;

export interface Course {
  id: bigint; // 链上课程ID (courseId)
  web2CourseId: string;
  name: string;
  price: bigint; // uint256
  isActive: boolean;
  creator: `0x${string}`;
  imageUrl: string; // 新增：课程图片 URL
  description: string; // 新增：课程描述
}

export function useCourseData() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(false);
  const [fetchCoursesError, setFetchCoursesError] = useState<Error | null>(null);
  
  const [userPurchasedCourseIds, setUserPurchasedCourseIds] = useState<Set<bigint>>(new Set());
  const [isLoadingUserCourses, setIsLoadingUserCourses] = useState<boolean>(false);

  const wagmiConfig = useConfig();
  const publicClient = usePublicClient({ config: wagmiConfig });
  const { address: accountAddress } = useAccount();

  const { 
    data: courseCountData, 
    isLoading: isLoadingCount, 
    error: courseCountError,
    refetch: refetchCourseCount 
  } = useReadContract({
    address: GEEK_COURSE_MARKET_ADDRESS,
    abi: geekCourseMarketABI,
    functionName: 'courseCount',
    // chainId: yourChainId, // 如果需要指定链
  });

  const courseCount = courseCountData ? BigInt(courseCountData.toString()) : undefined;

  const fetchAllCourses = useCallback(async () => {
    if (!publicClient) {
      // console.warn("Public client not available yet for fetching courses.");
      return;
    }
    if (courseCount === undefined) {
        // console.warn("Course count not available yet.");
        if (courseCountError) {
            setFetchCoursesError(courseCountError);
        }
        return;
    }
    if (courseCount === BigInt(0)) {
        setCourses([]);
        setIsLoadingCourses(false);
        setFetchCoursesError(null);
        return;
    }

    setIsLoadingCourses(true);
    setFetchCoursesError(null);
    try {
      const calls = [];
      for (let i = BigInt(1); i <= courseCount; i++) {
        calls.push({
          address: GEEK_COURSE_MARKET_ADDRESS,
          abi: geekCourseMarketABI,
          functionName: 'courses',
          args: [i],
        });
      }

      const results = await publicClient.multicall({
          contracts: calls as any, // any cast for simplicity with viem multicall typing
          allowFailure: true, 
      });

      const fetchedCoursesData: Course[] = [];
      results.forEach((result, index) => {
        if (result.status === 'success' && result.result) {
          const [web2CourseId, name, price, isActive, creator] = result.result as [string, string, bigint, boolean, `0x${string}`];
          // 使用 imageUrlLists 中的图片，如果课程数量超过图片数量，则循环使用
          const imageUrl = imageUrlLists[index % imageUrlLists.length]; 
          const description = `这是关于 ${name} 课程的详细描述。学习这门课程，你将掌握 ${name} 的核心知识和实践技能。非常适合希望在相关领域深入发展的学员。`;
          
          fetchedCoursesData.push({
            id: BigInt(index + 1), // courseId 是从 1 开始的
            web2CourseId,
            name,
            price,
            isActive,
            creator,
            imageUrl, // 添加 imageUrl
            description, // 添加 description
          });
        } else {
          console.warn(`Failed to fetch course with ID ${index + 1}: ${result.error?.message}`);
        }
      });
      setCourses(fetchedCoursesData);
    } catch (e) {
      console.error("Error fetching all courses:", e);
      setFetchCoursesError(e as Error);
    } finally {
      setIsLoadingCourses(false);
    }
  }, [publicClient, courseCount, courseCountError]);

  useEffect(() => {
    if (publicClient && courseCount !== undefined) {
      fetchAllCourses();
    }
  }, [publicClient, courseCount, fetchAllCourses]);
  
  const fetchUserPurchasedCourses = useCallback(async () => {
    if (!publicClient || !accountAddress || courses.length === 0) {
      setUserPurchasedCourseIds(new Set()); // Reset if no account or courses loaded
      return;
    }
    setIsLoadingUserCourses(true);
    try {
      const calls = courses.map(course => ({
        address: GEEK_COURSE_MARKET_ADDRESS,
        abi: geekCourseMarketABI,
        functionName: 'userCourses',
        args: [accountAddress, course.id], // userCourses takes user address and courseId
      }));
      
      const results = await publicClient.multicall({ 
          contracts: calls as any, // any cast for simplicity
          allowFailure: true 
      });

      const purchasedIds = new Set<bigint>();
      results.forEach((result, index) => {
        if (result.status === 'success' && result.result === true) {
          // courses[index].id should correspond to the courseId used in the call
          purchasedIds.add(courses[index].id);
        }
      });
      setUserPurchasedCourseIds(purchasedIds);
    } catch (e) {
      console.error("Error fetching user purchased courses:", e);
      // Optionally set an error state for user courses here
    } finally {
      setIsLoadingUserCourses(false);
    }
  }, [publicClient, accountAddress, courses]); // courses is a dependency

  useEffect(() => {
    // Fetch user courses when account or the list of courses changes
    fetchUserPurchasedCourses();
  }, [fetchUserPurchasedCourses]); // fetchUserPurchasedCourses itself has dependencies: publicClient, accountAddress, courses

  const refetchCourses = useCallback(async () => { // Renamed back from refetchAllData for now, or ensure it's exported if different
    await refetchCourseCount(); 
    // fetchAllCourses will be triggered by useEffect on courseCount change
    // fetchUserPurchasedCourses will be triggered by useEffect on courses change
  }, [refetchCourseCount]);


  // --- 购买课程逻辑 ---
  const { 
    data: purchaseHash, 
    error: purchaseTxError, 
    writeContractAsync 
  } = useWriteContract();

  // 新增状态来跟踪特定课程的购买状态
  const [purchasingCourseId, setPurchasingCourseId] = useState<string | null>(null);

  const purchaseCourse = useCallback(async (web2CourseId: string) => {
    if (!writeContractAsync) {
      console.error("Purchase function (writeContractAsync) is not available.");
      throw new Error("购买功能尚未准备好。");
    }
    if (!accountAddress) {
        throw new Error("钱包未连接。");
    }
    if (!GEEK_COURSE_MARKET_ADDRESS || GEEK_COURSE_MARKET_ADDRESS.startsWith('0xYour')) {
        throw new Error("合约地址未正确配置。");
    }
    
    const courseToBuy = courses.find(c => c.web2CourseId === web2CourseId);
    if (!courseToBuy) {
        console.error(`Course with web2CourseId ${web2CourseId} not found in local list.`);
        throw new Error("课程未找到。");
    }

    setPurchasingCourseId(web2CourseId); // 开始购买特定课程

    try {
      const txHash = await writeContractAsync({
        address: GEEK_COURSE_MARKET_ADDRESS,
        abi: geekCourseMarketABI,
        functionName: 'purchaseCourse',
        args: [web2CourseId], // 智能合约期望的是 web2CourseId
      });
      // purchaseHash 会被 useWaitForTransactionReceipt 自动追踪
      return txHash;
    } catch (err) {
      console.error("购买课程时出错:", err);
      setPurchasingCourseId(null); // 出错时清除购买状态
      throw err; 
    }
  }, [writeContractAsync, accountAddress, courses]);

  const { 
    isLoading: isConfirmingPurchase, 
    isSuccess: purchaseConfirmed, 
    error: purchaseConfirmationError,
    status: transactionStatus, // 可以获取更详细的交易状态
  } = useWaitForTransactionReceipt({
    hash: purchaseHash, // 当 purchaseHash 变化时，这个 hook 会重新执行
  });

  // 当交易完成（成功或失败）时，清除 purchasingCourseId
  useEffect(() => {
    if (purchaseHash && (transactionStatus === 'success' || transactionStatus === 'error')) {
      setPurchasingCourseId(null);
    }
  }, [transactionStatus, purchaseHash]);

  // Effect to refetch user's purchased courses after a successful purchase
  useEffect(() => {
    if (purchaseConfirmed) {
      fetchUserPurchasedCourses(); // Refetch user's courses
    }
  }, [purchaseConfirmed, fetchUserPurchasedCourses]);

  // 合并购买过程中的错误
  const purchaseError = purchaseTxError || purchaseConfirmationError;

  return {
    // 课程列表
    courses,
    isLoadingCourses: isLoadingCourses || isLoadingCount || isLoadingUserCourses, // Combined loading state
    fetchCoursesError: fetchCoursesError || courseCountError,
    courseCount,
    refetchCourses, // Exporting refetchCourses

    // 购买课程
    purchaseCourse,
    purchasingCourseId, // 导出当前正在购买的课程 ID
    isConfirmingPurchase, // 可以用来显示确认中的状态，如果需要更细致的区分
    purchaseConfirmed,
    purchaseError,
    purchaseHash,

    // 用户购买的课程
    userPurchasedCourseIds,
  };
}

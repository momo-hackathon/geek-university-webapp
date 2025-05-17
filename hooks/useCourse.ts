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
import GEEK_TOKEN_ABI_FULL from '../abis/geekToken.json';

const imageUrlLists = ['https://iihe.lk/wp-content/uploads/2024/12/Blockchain-1-1024x614-1.webp', 'https://www.coinsclone.com/wp-content/uploads/2023/08/DeFi-Smart-Contract-Development-Company-856x467.png', 'https://thepaymentsassociation.org/wp-content/uploads/sites/7/2023/09/DEFI.png', 'https://www.whataportrait.com/media/wordpress/5f3cfbe5e12c6e5d1d323934b8f68676.jpg', 'https://www.wedigraf.com/wp-content/uploads/2025/02/web3-certification-trainin-at-wedigraf-tech-hub-port-harcourt-and-uyo-nigeria-2048x1152.jpg', 'https://www.consultia.co/wp-content/uploads/2024/04/IMG_0595.webp']

// 使用 ABI 文件中的 abi 数组
const geekCourseMarketABI = GEEK_COURSE_MARKET_ABI_FULL.abi;
const geekTokenABI = GEEK_TOKEN_ABI_FULL.abi;

// 从环境变量加载合约地址，提供回退地址
const GEEK_COURSE_MARKET_ADDRESS = (process.env.NEXT_PUBLIC_GEEK_COURSE_MARKET_ADDRESS || '0xb8183861ec46D734B52cb1b15642FA1F0eAd956D') as `0x${string}`;
const GEEK_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_GEEK_TOKEN_ADDRESS || '0x0ec34267121eaBeec3E30A6cAcFba3Ea782807B1') as `0x${string}`;

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
  });

  const courseCount = courseCountData ? BigInt(courseCountData.toString()) : undefined;

  const fetchAllCourses = useCallback(async () => {
    if (!publicClient) {
      return;
    }
    if (courseCount === undefined) {
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
          contracts: calls as any,
          allowFailure: true, 
      });

      const fetchedCoursesData: Course[] = [];
      results.forEach((result, index) => {
        if (result.status === 'success' && result.result) {
          const [web2CourseId, name, price, isActive, creator] = result.result as [string, string, bigint, boolean, `0x${string}`];
          const imageUrl = imageUrlLists[index % imageUrlLists.length]; 
          const description = `这是关于 ${name} 课程的详细描述。学习这门课程，你将掌握 ${name} 的核心知识和实践技能。非常适合希望在相关领域深入发展的学员。`;
          
          fetchedCoursesData.push({
            id: BigInt(index + 1),
            web2CourseId,
            name,
            price,
            isActive,
            creator,
            imageUrl,
            description,
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
      setUserPurchasedCourseIds(new Set());
      return;
    }
    setIsLoadingUserCourses(true);
    try {
      const calls = courses.map(course => ({
        address: GEEK_COURSE_MARKET_ADDRESS,
        abi: geekCourseMarketABI,
        functionName: 'userCourses',
        args: [accountAddress, course.id],
      }));
      
      const results = await publicClient.multicall({ 
          contracts: calls as any,
          allowFailure: true 
      });

      const purchasedIds = new Set<bigint>();
      results.forEach((result, index) => {
        if (result.status === 'success' && result.result === true) {
          purchasedIds.add(courses[index].id);
        }
      });
      setUserPurchasedCourseIds(purchasedIds);
    } catch (e) {
      console.error("Error fetching user purchased courses:", e);
    } finally {
      setIsLoadingUserCourses(false);
    }
  }, [publicClient, accountAddress, courses]);

  useEffect(() => {
    fetchUserPurchasedCourses();
  }, [fetchUserPurchasedCourses]);

  const refetchCourses = useCallback(async () => {
    await refetchCourseCount(); 
  }, [refetchCourseCount]);

  const { 
    data: internalMarketPurchaseTxHash, 
    error: internalMarketPurchaseTxError, 
    writeContractAsync: purchaseMarketWriteAsync,
    reset: resetMarketPurchase
  } = useWriteContract();

  const { 
    isLoading: internalIsConfirmingMarket, 
    isSuccess: internalMarketPurchaseConfirmed, 
    error: internalMarketPurchaseConfirmationError,
    status: internalMarketPurchaseStatus
  } = useWaitForTransactionReceipt({
    hash: internalMarketPurchaseTxHash,
  });

  const { 
    data: internalApproveTxHash, 
    error: internalApproveTxError, 
    writeContractAsync: approveTokenWriteAsync,
    reset: resetApprove
  } = useWriteContract();

  const { 
    isLoading: internalIsConfirmingApproval, 
    isSuccess: internalApprovalConfirmed, 
    error: internalApprovalConfirmationError,
    status: internalApprovalStatus
  } = useWaitForTransactionReceipt({
    hash: internalApproveTxHash,
  });
  
  const [purchasingCourseId, setPurchasingCourseId] = useState<string | null>(null);
  const [pendingPurchaseInfo, setPendingPurchaseInfo] = useState<{ web2CourseId: string, price: bigint } | null>(null);

  const [effectivePurchaseHash, setEffectivePurchaseHash] = useState<`0x${string}` | undefined>();
  const [effectivePurchaseError, setEffectivePurchaseError] = useState<Error | null>(null);
  const [effectiveIsConfirming, setEffectiveIsConfirming] = useState<boolean>(false);
  const [effectivePurchaseConfirmed, setEffectivePurchaseConfirmed] = useState<boolean>(false);

  const resetAllActionStates = useCallback(() => {
    setEffectivePurchaseHash(undefined);
    setEffectivePurchaseError(null);
    setEffectiveIsConfirming(false);
    setEffectivePurchaseConfirmed(false);
    setPendingPurchaseInfo(null);
    resetApprove();
    resetMarketPurchase();
  }, [resetApprove, resetMarketPurchase]);

  const purchaseCourse = useCallback(async (web2CourseId: string) => {
    if (!approveTokenWriteAsync || !purchaseMarketWriteAsync) {
      console.error("Purchase or Approve function is not available.");
      const err = new Error("购买或授权功能尚未准备好。");
      setEffectivePurchaseError(err);
      throw err;
    }
    if (!accountAddress) {
      const err = new Error("钱包未连接。");
      setEffectivePurchaseError(err);
      throw err;
    }
    if (!GEEK_COURSE_MARKET_ADDRESS || GEEK_COURSE_MARKET_ADDRESS.startsWith('0xYour') || !GEEK_TOKEN_ADDRESS || GEEK_TOKEN_ADDRESS.startsWith('0xYour')) {
      const err = new Error("合约地址未正确配置。");
      setEffectivePurchaseError(err);
      throw err;
    }
    
    const courseToBuy = courses.find(c => c.web2CourseId === web2CourseId);
    if (!courseToBuy) {
      const err = new Error("课程未找到。");
      console.error(`Course with web2CourseId ${web2CourseId} not found in local list.`);
      setEffectivePurchaseError(err);
      throw err;
    }

    setPurchasingCourseId(web2CourseId);
    resetAllActionStates();

    if (courseToBuy.price === BigInt(0)) {
      try {
        const txHash = await purchaseMarketWriteAsync({
          address: GEEK_COURSE_MARKET_ADDRESS,
          abi: geekCourseMarketABI,
          functionName: 'purchaseCourse',
          args: [web2CourseId],
        });
        setEffectivePurchaseHash(txHash);
      } catch (err: any) {
        console.error("购买免费课程时出错:", err);
        setEffectivePurchaseError(err);
        setPurchasingCourseId(null);
        throw err;
      }
    } else {
      setPendingPurchaseInfo({ web2CourseId, price: courseToBuy.price });
      try {
        const txHash = await approveTokenWriteAsync({
          address: GEEK_TOKEN_ADDRESS,
          abi: geekTokenABI,
          functionName: 'approve',
          args: [GEEK_COURSE_MARKET_ADDRESS, courseToBuy.price],
        });
        setEffectivePurchaseHash(txHash);
      } catch (err: any) {
        console.error("授权代币时出错:", err);
        setEffectivePurchaseError(err);
        setPendingPurchaseInfo(null);
        setPurchasingCourseId(null);
        throw err;
      }
    }
  }, [
    accountAddress, courses, approveTokenWriteAsync, purchaseMarketWriteAsync, 
    resetAllActionStates, geekCourseMarketABI, geekTokenABI
  ]);

  useEffect(() => {
    if (internalApprovalConfirmed && pendingPurchaseInfo && purchaseMarketWriteAsync) {
      (async () => {
        try {
          const txHash = await purchaseMarketWriteAsync({
            address: GEEK_COURSE_MARKET_ADDRESS,
            abi: geekCourseMarketABI,
            functionName: 'purchaseCourse',
            args: [pendingPurchaseInfo.web2CourseId],
          });
          setEffectivePurchaseHash(txHash);
        } catch (err: any) {
          console.error("发起课程购买时出错 (post-approval):", err);
          setEffectivePurchaseError(err);
          setPurchasingCourseId(null); 
          setPendingPurchaseInfo(null);
        }
      })();
    }
  }, [internalApprovalConfirmed, pendingPurchaseInfo, purchaseMarketWriteAsync, geekCourseMarketABI]);

  useEffect(() => {
    if (!purchasingCourseId) {
      setEffectiveIsConfirming(false);
      return;
    }

    if (pendingPurchaseInfo) { 
      setEffectiveIsConfirming(internalIsConfirmingApproval);
      setEffectivePurchaseError(internalApproveTxError || internalApprovalConfirmationError);
      setEffectivePurchaseConfirmed(false);
    } else { 
      setEffectiveIsConfirming(internalIsConfirmingMarket);
      setEffectivePurchaseError(internalMarketPurchaseTxError || internalMarketPurchaseConfirmationError);
      setEffectivePurchaseConfirmed(internalMarketPurchaseConfirmed);
    }
  }, [
    purchasingCourseId, pendingPurchaseInfo,
    internalIsConfirmingApproval, internalApproveTxError, internalApprovalConfirmationError,
    internalIsConfirmingMarket, internalMarketPurchaseTxError, internalMarketPurchaseConfirmationError, internalMarketPurchaseConfirmed
  ]);
  
  useEffect(() => {
    if (!purchasingCourseId) return;

    const approvalFailed = internalApproveTxHash && internalApprovalStatus === 'error';
    const marketPurchaseFinalized = internalMarketPurchaseTxHash && (internalMarketPurchaseStatus === 'success' || internalMarketPurchaseStatus === 'error');

    if (pendingPurchaseInfo && approvalFailed) {
      setPurchasingCourseId(null);
      setPendingPurchaseInfo(null);
    } else if (!pendingPurchaseInfo && marketPurchaseFinalized) {
      setPurchasingCourseId(null);
    }
  }, [
    purchasingCourseId, pendingPurchaseInfo, 
    internalApproveTxHash, internalApprovalStatus, 
    internalMarketPurchaseTxHash, internalMarketPurchaseStatus
  ]);

  useEffect(() => {
    if (internalMarketPurchaseConfirmed) {
      fetchUserPurchasedCourses();
      setPendingPurchaseInfo(null);
    }
  }, [internalMarketPurchaseConfirmed, fetchUserPurchasedCourses]);

  return {
    courses,
    isLoadingCourses: isLoadingCourses || isLoadingCount,
    fetchCoursesError: fetchCoursesError || courseCountError,
    courseCount,
    refetchCourses,

    purchaseCourse,
    purchasingCourseId,
    isConfirmingPurchase: effectiveIsConfirming,
    purchaseConfirmed: effectivePurchaseConfirmed,
    purchaseError: effectivePurchaseError,
    purchaseHash: effectivePurchaseHash,

    userPurchasedCourseIds,
    isLoadingUserCourses,
  };
}

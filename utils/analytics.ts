/**
 * Plausible Analytics Event Tracking Utilities
 * 
 * 封装 Plausible 事件发送，统一管理所有分析事件
 */

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string | number> }) => void;
  }
}

/**
 * 发送 Plausible 自定义事件
 * @param eventName 事件名称
 * @param props 事件属性（只支持字符串、数字、布尔值）
 */
export const trackEvent = (eventName: string, props?: Record<string, string | number | boolean>) => {
  if (typeof window !== 'undefined' && window.plausible) {
    try {
      // 确保所有属性值都是标量类型（字符串、数字、布尔值）
      const sanitizedProps: Record<string, string | number> = {};
      
      if (props) {
        Object.entries(props).forEach(([key, value]) => {
          // 将布尔值转换为字符串
          if (typeof value === 'boolean') {
            sanitizedProps[key] = value ? 'true' : 'false';
          } else {
            sanitizedProps[key] = value;
          }
        });
      }
      
      // 开发环境：输出日志以便调试
      if (process.env.NODE_ENV === 'development') {
        console.log('[Plausible Event]', eventName, sanitizedProps);
      }
      
      window.plausible(eventName, { props: sanitizedProps });
    } catch (error) {
      console.error('Failed to track event:', eventName, error);
    }
  } else {
    // 如果 Plausible 未加载，输出警告
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.warn('[Plausible] Script not loaded. Event not tracked:', eventName);
    }
  }
};

/**
 * 将停留秒数转换为区间分类
 * @param seconds 停留秒数
 * @returns 区间分类字符串
 */
const getDurationRange = (seconds: number): string => {
  if (seconds >= 1 && seconds <= 5) {
    return '1-5秒';
  } else if (seconds >= 6 && seconds <= 15) {
    return '6-15秒';
  } else if (seconds >= 16 && seconds <= 30) {
    return '16-30秒';
  } else if (seconds >= 31 && seconds <= 60) {
    return '31-60秒';
  } else if (seconds >= 61 && seconds <= 120) {
    return '61-120秒';
  } else {
    return '120+秒';
  }
};

/**
 * 追踪视频停留时长
 * @param videoId 视频ID
 * @param videoTitle 视频标题
 * @param durationSeconds 停留秒数（整数）
 */
export const trackVideoViewDuration = (
  videoId: string,
  videoTitle: string,
  durationSeconds: number
) => {
  trackEvent('Video View Duration', {
    video_id: videoId,
    video_title: videoTitle,
    duration_seconds: durationSeconds, // 保留精确秒数，用于计算平均值
    duration_range: getDurationRange(durationSeconds), // 区间分类，便于查看分布
  });
};

/**
 * 追踪投票点击
 * @param videoId 视频ID
 * @param videoTitle 视频标题
 * @param side 选择的队伍 (A/B)
 * @param optionName 队伍名称
 * @param betAmount 投注金额
 * @param poolAPercent 池子A的百分比
 * @param poolBPercent 池子B的百分比
 * @param isFirstVote 是否是该视频的第一次投票
 */
export const trackVoteClicked = (
  videoId: string,
  videoTitle: string,
  side: 'A' | 'B',
  optionName: string,
  betAmount: number,
  poolAPercent: number,
  poolBPercent: number,
  isFirstVote: boolean
) => {
  trackEvent('Vote Clicked', {
    video_id: videoId,
    video_title: videoTitle,
    side: side,
    option_name: optionName,
    bet_amount: betAmount,
    pool_a_percent: poolAPercent,
    pool_b_percent: poolBPercent,
    is_first_vote: isFirstVote ? 'true' : 'false',
  });
};

/**
 * 追踪邮箱提交
 * @param source 提交来源
 * @param totalPoints 总资产价值
 * @param pendingWinnings 待结算金额
 * @param betCount 已投注次数
 * @param isReturningUser 是否之前提交过
 */
export const trackEmailSubmitted = (
  source: string,
  totalPoints: number,
  pendingWinnings: number,
  betCount: number,
  isReturningUser: boolean
) => {
  trackEvent('Email Submitted', {
    source: source,
    total_points: totalPoints,
    pending_winnings: pendingWinnings,
    bet_count: betCount,
    is_returning_user: isReturningUser,
  });
};


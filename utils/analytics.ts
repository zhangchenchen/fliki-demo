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
      
      window.plausible(eventName, { props: sanitizedProps });
    } catch (error) {
      console.error('Failed to track event:', eventName, error);
    }
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
    duration_seconds: durationSeconds, // 数字类型，便于在 Plausible 中计算平均值
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


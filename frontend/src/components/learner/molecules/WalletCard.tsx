'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { LearnerWallet } from '@/services/api';
import { Wallet, Gift, TrendingUp, CreditCard } from 'lucide-react';

interface WalletCardProps {
  wallet: LearnerWallet;
}

/**
 * کامپوننت کارت کیف پول فراگیر
 * Learner wallet card component
 */
export default function WalletCard({ wallet }: WalletCardProps) {
  // محاسبه درصد پیشرفت پاداش
  const rewardProgress = (wallet.rewards.current / wallet.rewards.target) * 100;

  return (
    <motion.div
      className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* پترن پس‌زمینه */}
      <div className="absolute inset-0 bg-white/5 rounded-xl">
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>
      </div>

      <div className="relative z-10">
        {/* هدر کارت */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-100">کیف پول</h3>
              <p className="text-xs text-blue-200">موجودی شما</p>
            </div>
          </div>
          <CreditCard className="w-6 h-6 text-blue-200" />
        </div>

        {/* موجودی اصلی */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-1">
            {wallet.balance.toLocaleString('fa-IR')} تومان
          </h2>
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <TrendingUp className="w-4 h-4" />
            <span>کل خرج: {wallet.totalSpent.toLocaleString('fa-IR')} تومان</span>
          </div>
        </div>

        {/* پاداش‌ها */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium">پاداش‌های شما</span>
            </div>
            <span className="text-sm text-blue-200">{wallet.rewards.level}</span>
          </div>

          {/* نوار پیشرفت پاداش */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-blue-200 mb-2">
              <span>{wallet.rewards.current.toLocaleString('fa-IR')}</span>
              <span>{wallet.rewards.target.toLocaleString('fa-IR')}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-yellow-400 to-yellow-300 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(rewardProgress, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          <p className="text-xs text-blue-200">
            تا پاداش بعدی {(wallet.rewards.target - wallet.rewards.current).toLocaleString('fa-IR')} امتیاز مانده
          </p>
        </div>

        {/* تراکنش‌های اخیر */}
        {wallet.transactions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <h4 className="text-sm font-medium mb-2 text-blue-100">آخرین تراکنش</h4>
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-200">{wallet.transactions[0].description}</span>
              <span className={`font-medium ${
                wallet.transactions[0].type === 'purchase' 
                  ? 'text-red-300' 
                  : 'text-green-300'
              }`}>
                {wallet.transactions[0].type === 'purchase' ? '-' : '+'}
                {wallet.transactions[0].amount.toLocaleString('fa-IR')}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
} 
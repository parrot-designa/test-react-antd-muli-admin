import React, { useState, FC } from 'react';
import OSS from 'ali-oss'
import common from '@/api'

export default async function AliOss() {
    const {
        accessKeyId,
        accessKeySecret,
        securityToken: stsToken
    } = await common.getOSS()

    return new OSS({
        region: 'oss-cn-beijing',
        accessKeyId,
        accessKeySecret,
        stsToken,
        bucket: 'yxs-zygl'
    })
}



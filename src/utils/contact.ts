export const WEBHOOK_URL = 'https://text.pingbal.com/webhook';
const SITE_NAME = '立刷';

export function formatSubmitTime() {
	const now = new Date();
	const pad = (value: number) => String(value).padStart(2, '0');

	return `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

export async function submitContactForm(data: {
	name: string;
	phone: string;
	product?: string;
	message: string;
	source?: string;
}) {
	const { name, phone, product, message, source } = data;

	if (!name.trim() || !phone.trim() || !message.trim()) {
		throw new Error('请完整填写姓名、电话和留言内容。');
	}

	const payload = {
		姓名: name.trim(),
		电话: phone.trim(),
		产品: product?.trim() || '未填写',
		留言: message.trim(),
		网站: SITE_NAME,
		来源: source?.trim() || '未知来源',
		时间: formatSubmitTime(),
	};

	const response = await fetch(WEBHOOK_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		throw new Error('提交失败，请稍后重试');
	}

	return { success: true, message: '提交成功' };
}

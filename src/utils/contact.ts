export const FEISHU_WEBHOOK_URL =
	'https://www.feishu.cn/flow/api/trigger-webhook/fcf533eb2a782b972061b0ec406f3dc7';
const SITE_NAME = '立刷POS官网';

export function formatSubmitTime() {
	return new Intl.DateTimeFormat('zh-CN', {
		timeZone: 'Asia/Shanghai',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	}).format(new Date());
}

export async function submitContactForm(data: {
	name: string;
	phone: string;
	company?: string;
	message: string;
}) {
	const { name, phone, company, message } = data;

	if (!name.trim() || !phone.trim() || !message.trim()) {
		throw new Error('请完整填写姓名、电话和留言内容。');
	}

	const payload = {
		name: name.trim(),
		phone: phone.trim(),
		company: company?.trim() ?? '',
		message: message.trim(),
		source: SITE_NAME,
		submit_time: formatSubmitTime(),
	};

	const response = await fetch(FEISHU_WEBHOOK_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		throw new Error('提交失败，请稍后重试');
	}

	return { success: true, message: '提交成功' };
}

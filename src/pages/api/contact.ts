import type { APIRoute } from 'astro';

export const prerender = false;

const FEISHU_WEBHOOK_URL =
	'https://www.feishu.cn/flow/api/trigger-webhook/fcf533eb2a782b972061b0ec406f3dc7';
const SITE_NAME = '立刷POS官网';

const json = (body: Record<string, unknown>, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	});

const formatSubmitTime = () =>
	new Intl.DateTimeFormat('zh-CN', {
		timeZone: 'Asia/Shanghai',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	}).format(new Date());

export const POST: APIRoute = async ({ request }) => {
	try {
		const { name, phone, company, message } = (await request.json()) as {
			name?: string;
			phone?: string;
			company?: string;
			message?: string;
		};

		const safeName = name?.trim() ?? '';
		const safePhone = phone?.trim() ?? '';
		const safeCompany = company?.trim() ?? '';
		const safeMessage = message?.trim() ?? '';

		if (!safeName || !safePhone || !safeMessage) {
			return json({ success: false, message: '请完整填写姓名、电话和留言内容。' }, 400);
		}

		const payload = {
			name: safeName,
			phone: safePhone,
			source: SITE_NAME,
			message: safeMessage,
			submit_time: formatSubmitTime(),
			company: safeCompany,
		};

		const webhookResponse = await fetch(FEISHU_WEBHOOK_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		if (!webhookResponse.ok) {
			return json({ success: false, message: '飞书接收失败，请稍后重试。' }, 502);
		}

		return json({ success: true, message: '提交成功' });
	} catch (error) {
		console.error('Failed to submit contact form:', error);
		return json({ success: false, message: '提交失败，请稍后重试。' }, 500);
	}
};

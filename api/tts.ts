import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  const { text } = req.body || {};
  if (!text) {
    res.status(400).json({ error: 'text is required' });
    return;
  }

  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata('en-US-AriaNeural', OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(text);

    const chunks: Buffer[] = [];
    audioStream.on('data', (chunk: Buffer) => chunks.push(chunk));
    audioStream.on('close', () => {
      const audio = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', audio.length.toString());
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(audio);
    });
    audioStream.on('error', (err: Error) => {
      res.status(500).json({ error: err.message });
    });
  } catch (e: unknown) {
    res.status(502).json({ error: e instanceof Error ? e.message : 'TTS error' });
  }
}

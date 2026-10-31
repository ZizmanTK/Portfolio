# Provenance of the drawings in this folder

Copied from the design workspace of mockup A ("Walk through a day", round 7), whose `art/LICENSES.md` is reproduced
below unchanged. In that file, `site/art/<name>` is the file `src/assets/art/<name>` here.

- Checked before copying: every drawing shipped here was made with Qwen-Image-2512 or Qwen-Image-Edit-2511 (Apache-2.0),
  the lightx2v Lightning LoRAs (Apache-2.0) and his own LoRA (trained on his own photos), and cut out with BiRefNet and
  rembg (MIT). No Qwen-Image 2.1, Ideogram, Fibo or FLUX.2-dev output is used anywhere.
- Shipped here (32): niamey, walk, chess, knight, rabat, board, coat, strasbourg, piano, safety2, wall-steel-wide,
  wall-rock-wide, cl-start, cl-highstep, cl-pull, grenoble, summit, desk, desknight, dice, vb-ready, vb-set, vb-approach,
  vb-takeoff, vb-cocked, vb-contact, signature and the five postcards (card-niamey, card-rabat, card-strasbourg,
  card-uckange, card-grenoble).
- Not shipped: `site/art/rollpower.webp`, `site/art/zktris.webp`, the crown icons (the site keeps its own
  `assets/img/favicon.svg` and `assets/img/apple-touch-icon.png`). The project screenshots and figures listed under "His own
  assets" are the portfolio's own files in `src/assets/img/projects/` (`coilcheck-tight.webp`, `remind-full.webp`,
  `txbot.webp`, and the game posters); the gameplay clips are in `src/assets/video/`.
- The round-5 parents of the three climbing poses, which `LICENSES.md` points to in the generation log, are listed in the
  appendix at the end.
- This file is kept out of the published site (angular.json ignores `*.md` under `src/assets`).

---

# Art licences and provenance (round 7)

Every AI image on the page comes from models whose licences allow publishing (Apache-2.0), trained or prompted on his own
photos. No Qwen-Image 2.1 output was used anywhere. Real photos, project images and logos are his own.

## Models and tools

| What | Used for | Licence |
|---|---|---|
| Qwen-Image-2512 (`qwen_image_2512_fp8_e4m3fn.safetensors`) | the drawings of him (with his LoRA), places, walls, postcards, the knight | Apache-2.0 |
| His LoRA `azmz_qi2512.safetensors` (trigger `azmz`), trained here on Qwen-Image-2512 with musubi-tuner | his likeness, at 16, at 19 and today | trained on his own photos; base Apache-2.0; musubi-tuner Apache-2.0 |
| Qwen-Image-Edit-2511 (`qwen_image_edit_2511_fp8mixed.safetensors`) | drawings redrawn from his photos, the flat redraws, and the round-7 redraw of every drawing of him in one style | Apache-2.0 |
| Qwen2.5-VL-7B text encoder (bf16 for the training captions, fp8 in ComfyUI) and Qwen-Image VAE (Comfy-Org/Qwen-Image_ComfyUI) | all of the above | Apache-2.0 |
| Qwen-Image-Lightning 4-step and Qwen-Image-Edit-2511-Lightning 8-step LoRAs (lightx2v) | drafts, and most round-6 and round-7 finals (8 steps; each image below says which) | Apache-2.0 |
| BiRefNet `birefnet-general` through rembg | transparent cut-outs | MIT (BiRefNet), MIT (rembg) |
| own scripts (`work/tools/`): `skykey.py`, `deframe.py`, `r6export.py`, `vbposes.py`, `snap7.py`, `r7proc.py`, `walltile.py`, `climbtraverse.py` | sky keying, frame removal, export, the volleyball pose mannequins, the one palette, the wide walls, the traverse | own code |

Client: `work/tools/gen2.py` (official ComfyUI templates). Every generation is logged in `art/LICENSES-log.jsonl`.
The Qwen-Image-2512 negative prompt is the template's own (Chinese: low resolution, low quality, deformed limbs and fingers,
oversaturated, waxy, faceless, over-smooth, an AI look, a messy composition, blurred or distorted text).

## His LoRA: training data and settings

Trained on 22 crops of 12 of his photos (`work/r6/prep_dataset.py`; face crops at 768 px, framed photos at 640 px):
the three new face photos (2016 and 2019), the four activity photos (two are the same files as the 2026 face photos),
`headshot.jpg`, `portrait.webp`, `me_day.jpg`, `me_night.jpg`, `me_smile_kaftan.webp`. `me_day_bg.jpg` was left out: it is a
night skyline with nobody in it; `portrait-day.webp` and `portrait-cutout.webp` are the same photos as `me_day.jpg` and `portrait.webp`.
musubi-tuner `qwen_image_train_network.py`, fp8 base (block-scaled, read from the fp8 checkpoint ComfyUI uses),
40 of 60 blocks swapped to RAM, rank 32 / alpha 32, AdamW 8-bit, lr 1e-4, qwen_shift timesteps, 1000 steps, seed 42
(`work/r6/train_lora.sh`, 12.0 s per step on the RTX 5060 Ti 16 GB: 3 h 20 min for the 1000 steps, plus a few minutes of loading).
Checkpoints at 250, 500, 750 and 1000 steps were compared on the same prompts and seeds (teen, today, a photo of today,
three-quarter; `renders/lora-checkpoints.jpg`): the final one (1000 steps) is the closest to his photos and is the one used.

Captions: one per crop, describing the photo in a sentence. They stay in the design workspace and are not reproduced here.

## His face, drawn once (round 7)

One drawing of his face from his round-6 portrait drawing (itself redrawn from his headshot photo), then the same face at 16 and 19 and in profile; every drawing of him on the page is redrawn with one of these as image 2 (cropped to the head, colours snapped to the palette), so the face is built the same way everywhere.

- `e6l_portrait_lc_s8001.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 8001, 8 steps, CFG 1.0, image1
  - inputs: image 1 = his headshot photo (`src/assets/img/headshot.jpg`)
  - prompt: Redraw image 1 as a clean ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette, a simple clean face. Keep the same man: his exact face shape, eyes, nose, mouth, beard and hairline, his dark brown skin and his very slim build, and keep the same pose, framing and clothes. A head-and-shoulders portrait, front view, navy blazer over a white open-collar shirt. Plain flat light grey background.
  - negative prompt: blurry, photo, photorealistic, shading, gradient, hatching, extra fingers, deformed hands, text, watermark
- `ref7_now_s9900.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9900, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `e6l_portrait_lc_s8001.png`
  - prompt: Keep this exact drawing of the man's head: the same long face, eyes, eyebrows, nose, mouth, ears, hairline, short black hair and the outline of his short black beard and moustache. Dress him in a plain dark grey crew-neck t-shirt instead of the jacket and shirt. Keep the same thin, even dark-brown ink outlines and completely flat colour fills: no shading, no gradients, no highlights, no texture; his skin is one flat dark brown with at most one flat darker-brown shadow tone. Plain flat light grey background.
- `ref7_teen_s9900.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9900, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `e6l_portrait_lc_s8001.png`
  - prompt: Redraw this drawing as the same person at 16, a slim teenage boy: no beard, no moustache, no stubble, a slightly rounder and younger face, the same eyes, eyebrows, nose, ears, hairline and short black hair, drawn with the same few simple lines. He wears a white short-sleeve polo shirt with a blue collar. Keep the same thin, even dark-brown ink outlines and completely flat colour fills: no shading, no gradients, no highlights, no texture; his skin is one flat dark brown with at most one flat darker-brown shadow tone. Plain flat light grey background.
- `ref7_student_s9900.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9900, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `e6l_portrait_lc_s8001.png`
  - prompt: Redraw this drawing as the same person at 19, a slim young student: no beard, only a very thin moustache, a younger face, the same eyes, eyebrows, nose, ears, hairline and short black hair, drawn with the same few simple lines. He wears a plain dark grey crew-neck t-shirt. Keep the same thin, even dark-brown ink outlines and completely flat colour fills: no shading, no gradients, no highlights, no texture; his skin is one flat dark brown with at most one flat darker-brown shadow tone. Plain flat light grey background.
- `ref7_teen_side_s9930.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9930, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `ref7_teen_snap.png` (his face as drawn once for round 7, see "His face, drawn once" above)
  - prompt: Draw the same boy, head and shoulders, seen exactly from the side (a profile view facing to the right), with a slight smile; the same face, hairline and short black hair, no beard. Keep the same drawing style exactly: the same thin, even dark-brown outlines, completely flat colours, the same flat dark brown skin with at most one flat shadow tone, the same simple eyes, eyebrows, nose, mouth and ears. Plain flat light grey background.
- `ref7_now_side_s9930.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9930, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `ref7_now_snap.png` (his face as drawn once for round 7, see "His face, drawn once" above)
  - prompt: Draw the same man, head and shoulders, seen exactly from the side (a profile view facing to the right); the same long face, hairline, short black hair and the outline of his short black beard. Keep the same drawing style exactly: the same thin, even dark-brown outlines, completely flat colours, the same flat dark brown skin with at most one flat shadow tone, the same simple eyes, eyebrows, nose, mouth and ears. Plain flat light grey background.

## Images on the page (one style: ligne claire)

Round 7: every drawing of him was redrawn in one way (`art/r7/ref7_*`: his face drawn once at 16, 19 and today, front and side, from his round-6 portrait drawing) and snapped to one palette (`work/tools/snap7.py`; canonical colours on `renders/consistency-sheet.jpg`). The round-6 detailed style is gone from the page (its files are kept in `art/r6/site-detail-r6/`).

### `site/art/walk.webp`

At 16 in Niamey, walking with his school bag.

Made from:

- `f6_walk_s9200.png`: Qwen-Image-2512 (Apache-2.0), his LoRA `azmz_qi2512.safetensors:1.0` (trained on his photos, see above); refine of a draft; seed 9200, 20 steps, CFG 4.0, denoise 0.62, 832x1216
  - prompt: A full-body drawing of azmz as a teenager in 2016, a very slim boy, walking to the right in side view, mid-stride, relaxed, a dark school backpack on one shoulder, a slight smile. He wears a white short-sleeve polo shirt with a blue collar and blue sleeve trims, light beige cotton trousers and white sneakers. A ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette. Only the figure, on a plain flat light grey background.
  - starts from `d6_walk_s9200.png`:
    - `d6_walk_s9200.png`: Qwen-Image-2512 (Apache-2.0), his LoRA `azmz_qi2512.safetensors:1.0` (trained on his photos, see above), Lightning LoRA Qwen-Image-Lightning-4steps-V1.0.safetensors (lightx2v, Apache-2.0); text to image; seed 9200, 4 steps, CFG 1.0, 832x1216
      - prompt: A full-body drawing of azmz as a teenager in 2016, a very slim boy, walking to the right in side view, mid-stride, relaxed, a dark school backpack on one shoulder, a slight smile. He wears a white short-sleeve polo shirt with a blue collar and blue sleeve trims, light beige cotton trousers and white sneakers. A ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette. Only the figure, on a plain flat light grey background.
- `rt7_walk_s9940.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9940, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `f6_walk_s9200.png`; image 2 = `ref7_teen_side_head.png` (his face as drawn once for round 7, see "His face, drawn once" above)
  - prompt: Image 1 is a drawing of a man; image 2 shows only how his head is drawn. Redraw image 1 so that his head looks exactly like the boy in image 2 (16, no beard, no moustache) and is drawn in exactly the same way: the same face construction (the same simple eyes, eyebrows, nose, mouth and ears, the same hairline, short black hair, no beard), the same flat dark brown skin with at most one flat shadow tone, the same thin, even dark-brown outlines, at the angle of his head in image 1. Keep everything else of image 1 exactly as it is: the pose, the position and size of every limb, both hands, his clothes exactly as in image 1 (a white short-sleeve polo shirt with a blue collar, beige trousers, white sneakers and a dark backpack), every object and the framing. Completely flat colours, no shading, no gradients, no highlights, no texture. Plain flat light grey background.
- after: background removed with BiRefNet; his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`); trimmed and scaled (`work/tools/r6export.py`), WebP q88.

### `site/art/chess.webp`

At 16 in Niamey, at the chess table.

Made from:

- `d6_chess_s9210.png`: Qwen-Image-2512 (Apache-2.0), his LoRA `azmz_qi2512.safetensors:1.0` (trained on his photos, see above), Lightning LoRA Qwen-Image-Lightning-4steps-V1.0.safetensors (lightx2v, Apache-2.0); text to image; seed 9210, 4 steps, CFG 1.0, 1024x1024
  - prompt: A drawing of azmz as a teenager in 2016, a very slim boy, sitting on a simple wooden stool at a small low wooden table, leaning over a chess board with its pieces, his right hand moving a white knight; an open notebook with handwritten maths lies beside the board. Three-quarter view from the front-left, calm and focused, a slight smile. He wears a white short-sleeve polo shirt with a blue collar and blue sleeve trims, light beige trousers and white sneakers. The stool, the table, the board and the notebook are drawn complete. A ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette. Only the figure, on a plain flat light grey background.
- `fl6b_chess_s9801.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9801, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `d6_chess_s9210.png`
  - prompt: Redraw this exact picture as a clean ligne claire comic drawing. He is a teenage boy of about 16: keep his smooth young face with no beard, no moustache and no stubble. Keep the same person with exactly the same face, hair, skin tone, expression, pose, clothes and objects, and the same composition and framing. Make every colour area completely flat: remove all shading, shadows, gradients, highlights, wood grain and textures. Thin, perfectly even dark-brown ink outlines. Plain flat light grey background with nothing else, no floor shadow.
- `rs7_chess_s9910.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9910, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `fl6b_chess_s9801.png`; image 2 = `ref7_teen_snap.png` (his face as drawn once for round 7, see "His face, drawn once" above)
  - prompt: Image 1 is a drawing of a man; image 2 shows how this man is drawn. Redraw image 1 so that he looks exactly like the boy in image 2 (16, no beard, no moustache) and is drawn in exactly the same way: the same face construction (the same simple eyes, eyebrows, nose, mouth and ears, the same hairline, short black hair, no beard), the same flat dark brown skin with at most one flat shadow tone, the same thin, even dark-brown outlines. Keep everything else of image 1 exactly as it is: the pose, the angle of his head, the position and size of every limb, both hands, his clothes and their colours, every object and the framing. Completely flat colours, no shading, no gradients, no highlights, no texture. Plain flat light grey background.
- after: background removed with BiRefNet (furniture kept with `cutout.py --repair`); his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`); trimmed and scaled (`work/tools/r6export.py`), WebP q88.

### `site/art/board.webp`

At 19, a student in Rabat, at the chalkboard.

Made from:

- `d6_board_s9220.png`: Qwen-Image-2512 (Apache-2.0), his LoRA `azmz_qi2512.safetensors:1.0` (trained on his photos, see above), Lightning LoRA Qwen-Image-Lightning-4steps-V1.0.safetensors (lightx2v, Apache-2.0); text to image; seed 9220, 4 steps, CFG 1.0, 1024x1024
  - prompt: A drawing of azmz as a young student in 2019, a very slim young man, standing at a large dark green chalkboard on a wooden easel, writing maths in white chalk (an integral sign and a small matrix in brackets), seen in three-quarter view from the left, his face turned slightly toward the viewer. He wears a black jacket over a dark patterned shirt, dark trousers and dark sneakers; a dark backpack stands on the floor against the easel. The whole easel and board are drawn complete. A ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette. Only the figure, on a plain flat light grey background.
- `fl6b_board_s9801.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9801, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `d6_board_s9220.png`
  - prompt: Redraw this exact picture as a clean ligne claire comic drawing. He is a young student of about 19: keep his young face with no beard and no moustache. Keep the same person with exactly the same face, hair, skin tone, expression, pose, clothes and objects, and the same composition and framing. Make every colour area completely flat: remove all shading, shadows, gradients, highlights, wood grain and textures. Thin, perfectly even dark-brown ink outlines. Keep the green chalkboard and its chalk writing. Plain flat light grey background with nothing else, no floor shadow.
- `rt7_board_s9940.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9940, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `fl6b_board_s9801.png`; image 2 = `ref7_student_head.png` (his face as drawn once for round 7, see "His face, drawn once" above)
  - prompt: Image 1 is a drawing of a man; image 2 shows only how his head is drawn. Redraw image 1 so that his head looks exactly like the young man in image 2 (19, no beard) and is drawn in exactly the same way: the same face construction (the same simple eyes, eyebrows, nose, mouth and ears, the same hairline, short black hair, no beard), the same flat dark brown skin with at most one flat shadow tone, the same thin, even dark-brown outlines, at the angle of his head in image 1. Keep everything else of image 1 exactly as it is: the pose, the position and size of every limb, both hands, his clothes exactly as in image 1 (a black jacket over a dark patterned shirt, dark blue trousers and dark sneakers), every object and the framing. Completely flat colours, no shading, no gradients, no highlights, no texture. Plain flat light grey background. Keep the green chalkboard and its chalk writing and the backpack.
- after: background removed with BiRefNet (furniture kept with `cutout.py --repair`); his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`); trimmed and scaled (`work/tools/r6export.py`), WebP q88.

### `site/art/coat.webp`

A student in Strasbourg, winter coat and scarf.

Made from:

- `d6_coat_s9231.png`: Qwen-Image-2512 (Apache-2.0), his LoRA `azmz_qi2512.safetensors:1.0` (trained on his photos, see above), Lightning LoRA Qwen-Image-Lightning-4steps-V1.0.safetensors (lightx2v, Apache-2.0); text to image; seed 9231, 4 steps, CFG 1.0, 832x1216
  - prompt: A full-body drawing of azmz as a young student in 2019, a very slim young man, walking to the right in side view, mid-stride, in winter: a dark navy wool coat, a mustard-yellow knitted scarf, grey trousers and dark brown boots, hands in his coat pockets, a slight smile. A ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette. Only the figure, on a plain flat light grey background.
- `fl6_coat_s9800.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9800, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `d6_coat_s9231.png`
  - prompt: Redraw this exact picture as a clean ligne claire comic drawing. Keep the same person with exactly the same face, beard, hair, skin tone, expression, pose, clothes and objects, and the same composition and framing. Make every colour area completely flat: remove all shading, shadows, gradients, highlights, wood grain and textures. Thin, perfectly even dark-brown ink outlines. Plain flat light grey background with nothing else, no floor shadow.
- `rt7_coat_s9943.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9943, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `fl6_coat_s9800.png`; image 2 = `ref7_student_head.png` (his face as drawn once for round 7, see "His face, drawn once" above)
  - prompt: Image 1 is a drawing of a man; image 2 shows only how his head is drawn. Redraw image 1 so that his head looks exactly like the young man in image 2 (19, no beard) and is drawn in exactly the same way: the same face construction (the same simple eyes, eyebrows, nose, mouth and ears, the same hairline, short black hair, no beard), the same flat dark brown skin with at most one flat shadow tone, the same thin, even dark-brown outlines, at the angle of his head in image 1, with both eyes open and his whole face drawn (eyes, eyebrows, nose and mouth all visible). Keep everything else of image 1 exactly as it is: the pose, the position and size of every limb, both hands, his clothes exactly as in image 1 (a dark navy wool coat, a mustard-yellow knitted scarf, grey trousers and dark brown boots), every object and the framing. Completely flat colours, no shading, no gradients, no highlights, no texture. Plain flat light grey background.
- after: background removed with BiRefNet; his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`); trimmed and scaled (`work/tools/r6export.py`), WebP q88.

### `site/art/piano.webp`

Today, at the upright piano, headphones around his neck.

Made from:

- `d6_piano_s9240.png`: Qwen-Image-2512 (Apache-2.0), his LoRA `azmz_qi2512.safetensors:1.0` (trained on his photos, see above), Lightning LoRA Qwen-Image-Lightning-4steps-V1.0.safetensors (lightx2v, Apache-2.0); text to image; seed 9240, 4 steps, CFG 1.0, 1024x1024
  - prompt: A drawing of azmz, a tall, very slim man, sitting on a piano bench playing an upright wooden piano, seen from the side in three-quarter view so his face shows in profile, both hands on the keys, over-ear headphones around his neck; on top of the piano an open laptop shows a sound waveform. He wears a burgundy knitted wool sweater, dark trousers and brown shoes. The piano and the bench are drawn complete. A ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette. Only the figure, on a plain flat light grey background.
- `fl6_piano_s9800.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9800, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `d6_piano_s9240.png`
  - prompt: Redraw this exact picture as a clean ligne claire comic drawing. Keep the same person with exactly the same face, beard, hair, skin tone, expression, pose, clothes and objects, and the same composition and framing. Make every colour area completely flat: remove all shading, shadows, gradients, highlights, wood grain and textures. Thin, perfectly even dark-brown ink outlines. Keep the upright piano, the stool and the laptop on the piano. Plain flat light grey background with nothing else, no floor shadow.
- `rt7_piano_s9940.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9940, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `fl6_piano_s9800.png`; image 2 = `ref7_now_side_head.png` (his face as drawn once for round 7, see "His face, drawn once" above)
  - prompt: Image 1 is a drawing of a man; image 2 shows only how his head is drawn. Redraw image 1 so that his head looks exactly like the man in image 2 and is drawn in exactly the same way: the same face construction (the same simple eyes, eyebrows, nose, mouth and ears, the same hairline, short black hair and the outline of his short black beard and moustache), the same flat dark brown skin with at most one flat shadow tone, the same thin, even dark-brown outlines, at the angle of his head in image 1. Keep everything else of image 1 exactly as it is: the pose, the position and size of every limb, both hands, his clothes exactly as in image 1 (a burgundy sweater, dark grey trousers, brown shoes and black headphones around his neck), every object and the framing. Completely flat colours, no shading, no gradients, no highlights, no texture. Plain flat light grey background. Keep the upright piano, the stool and the laptop on the piano.
- after: background removed with BiRefNet (furniture kept with `cutout.py --repair`); his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`); trimmed and scaled (`work/tools/r6export.py`); mirrored left-right as before, WebP q88.

### `site/art/safety2.webp`

Today, at the Uckange plant: hard hat, glasses, high-vis vest, tablet.

Made from:

- `d6_safety2_s9250.png`: Qwen-Image-2512 (Apache-2.0), his LoRA `azmz_qi2512.safetensors:1.0` (trained on his photos, see above), Lightning LoRA Qwen-Image-Lightning-4steps-V1.0.safetensors (lightx2v, Apache-2.0); text to image; seed 9250, 4 steps, CFG 1.0, 832x1216
  - prompt: A full-body drawing of azmz, a tall, very slim man in steel-plant work gear: a white hard hat, clear safety glasses, a bright orange high-visibility vest with grey reflective stripes over a dark grey long-sleeve work shirt, dark grey work trousers and black safety shoes. He stands in three-quarter view turned to the left, holding a tablet in both hands at chest height and looking down at it, calm and focused. A ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette. Only the figure, on a plain flat light grey background.
- `fl6_safety2_s9800.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9800, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `d6_safety2_s9250.png`
  - prompt: Redraw this exact picture as a clean ligne claire comic drawing. Keep the same person with exactly the same face, beard, hair, skin tone, expression, pose, clothes and objects, and the same composition and framing. Make every colour area completely flat: remove all shading, shadows, gradients, highlights, wood grain and textures. Thin, perfectly even dark-brown ink outlines. Plain flat light grey background with nothing else, no floor shadow.
- `rt7_safety2_s9940.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9940, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `fl6_safety2_s9800.png`; image 2 = `ref7_now_head.png` (his face as drawn once for round 7, see "His face, drawn once" above)
  - prompt: Image 1 is a drawing of a man; image 2 shows only how his head is drawn. Redraw image 1 so that his head looks exactly like the man in image 2 and is drawn in exactly the same way: the same face construction (the same simple eyes, eyebrows, nose, mouth and ears, the same hairline, short black hair and the outline of his short black beard and moustache), the same flat dark brown skin with at most one flat shadow tone, the same thin, even dark-brown outlines, at the angle of his head in image 1. Keep everything else of image 1 exactly as it is: the pose, the position and size of every limb, both hands, his clothes exactly as in image 1 (a white hard hat, clear safety glasses, an orange high-visibility vest with grey reflective stripes over a dark grey long-sleeve work shirt, grey work trousers and black safety boots; he holds a tablet), every object and the framing. Completely flat colours, no shading, no gradients, no highlights, no texture. Plain flat light grey background.
- after: background removed with BiRefNet; his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`); trimmed and scaled (`work/tools/r6export.py`), WebP q88.

### `site/art/desk.webp`

Today, at his desk by day.

Made from:

- `d6_desk_s9260.png`: Qwen-Image-2512 (Apache-2.0), his LoRA `azmz_qi2512.safetensors:1.0` (trained on his photos, see above), Lightning LoRA Qwen-Image-Lightning-4steps-V1.0.safetensors (lightx2v, Apache-2.0); text to image; seed 9260, 4 steps, CFG 1.0, 1024x1024
  - prompt: A drawing of azmz, a tall, very slim man, sitting on an office chair at a light wooden desk, working on a laptop with a large monitor beside it; the monitor shows a line chart and a bar chart; a mug on the desk. Three-quarter view from the front-right, focused, a slight smile. He wears a light-blue oxford button-down shirt with the sleeves rolled up, dark navy chinos and brown leather shoes. The desk and the chair are drawn complete. A ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette. Only the figure, on a plain flat light grey background.
- `fl6_desk_s9800.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9800, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `d6_desk_s9260.png`
  - prompt: Redraw this exact picture as a clean ligne claire comic drawing. Keep the same person with exactly the same face, beard, hair, skin tone, expression, pose, clothes and objects, and the same composition and framing. Make every colour area completely flat: remove all shading, shadows, gradients, highlights, wood grain and textures. Thin, perfectly even dark-brown ink outlines. Plain flat light grey background with nothing else, no floor shadow.
- `rt7_desk_s9940.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9940, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `fl6_desk_s9800.png`; image 2 = `ref7_now_head.png` (his face as drawn once for round 7, see "His face, drawn once" above)
  - prompt: Image 1 is a drawing of a man; image 2 shows only how his head is drawn. Redraw image 1 so that his head looks exactly like the man in image 2 and is drawn in exactly the same way: the same face construction (the same simple eyes, eyebrows, nose, mouth and ears, the same hairline, short black hair and the outline of his short black beard and moustache), the same flat dark brown skin with at most one flat shadow tone, the same thin, even dark-brown outlines, at the angle of his head in image 1. Keep everything else of image 1 exactly as it is: the pose, the position and size of every limb, both hands, his clothes exactly as in image 1 (a light blue button-up shirt, dark blue jeans and brown shoes), every object and the framing. Completely flat colours, no shading, no gradients, no highlights, no texture. Plain flat light grey background.
- after: background removed with BiRefNet (furniture kept with `cutout.py --repair`); his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`); trimmed and scaled (`work/tools/r6export.py`), WebP q88.

### `site/art/desknight.webp`

Today, at his desk at night.

Made from:

- `d6_desknight_s9270.png`: Qwen-Image-2512 (Apache-2.0), his LoRA `azmz_qi2512.safetensors:1.0` (trained on his photos, see above), Lightning LoRA Qwen-Image-Lightning-4steps-V1.0.safetensors (lightx2v, Apache-2.0); text to image; seed 9270, 4 steps, CFG 1.0, 1024x1024
  - prompt: A drawing of azmz, a tall, very slim man at night, sitting on an office chair at a wooden desk lit by a brass desk lamp; the monitor shows a diagram of connected nodes; he leans back, relaxed, a slight smile. Three-quarter view from the front-left. He wears a plain grey hoodie, dark grey joggers and white sneakers. The desk, the lamp and the chair are drawn complete. A ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette. Only the figure, on a plain flat light grey background.
- `fl6_desknight_s9800.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9800, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `d6_desknight_s9270.png`
  - prompt: Redraw this exact picture as a clean ligne claire comic drawing. Keep the same person with exactly the same face, beard, hair, skin tone, expression, pose, clothes and objects, and the same composition and framing. Make every colour area completely flat: remove all shading, shadows, gradients, highlights, wood grain and textures. Thin, perfectly even dark-brown ink outlines. Remove the window and the night sky behind him; keep the desk, the lamp, the monitor with its diagram, the keyboard and the chair. Plain flat light grey background with nothing else, no floor shadow.
- `rt7_desknight_s9941.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9941, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `fl6_desknight_s9800.png`; image 2 = `ref7_now_head.png` (his face as drawn once for round 7, see "His face, drawn once" above)
  - prompt: Image 1 is a drawing of a man; image 2 shows only how his head is drawn. Redraw image 1 so that his head looks exactly like the man in image 2 and is drawn in exactly the same way: the same face construction (the same simple eyes, eyebrows, nose, mouth and ears, the same hairline, short black hair and the outline of his short black beard and moustache), the same flat dark brown skin with at most one flat shadow tone, the same thin, even dark-brown outlines, at the angle of his head in image 1. Keep everything else of image 1 exactly as it is: the pose, the position and size of every limb, both hands, his clothes exactly as in image 1 (a grey zip hoodie, grey joggers and white sneakers), every object and the framing. Completely flat colours, no shading, no gradients, no highlights, no texture. Keep the wooden desk with its drawers, the brass desk lamp, the monitor with its diagram of connected nodes, the keyboard, the pencil pot and the black office chair he sits on, exactly where they are. Plain flat light grey background.
- after: background removed with BiRefNet (furniture kept with `cutout.py --repair`); his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`); trimmed and scaled (`work/tools/r6export.py`), WebP q88.

### `site/art/dice.webp`

Today, tossing the die (the page throws its own die).

Made from:

- `d6_dice_s9280.png`: Qwen-Image-2512 (Apache-2.0), his LoRA `azmz_qi2512.safetensors:1.0` (trained on his photos, see above), Lightning LoRA Qwen-Image-Lightning-4steps-V1.0.safetensors (lightx2v, Apache-2.0); text to image; seed 9280, 4 steps, CFG 1.0, 832x1216
  - prompt: A full-body drawing of azmz, a tall, very slim man, tossing a large white six-sided die into the air with his right hand: the die is clearly separated from his open hand, in mid-air above and to the side of it, showing three pips; three-quarter front view, a playful smile. He wears a grey zip hoodie, black over-ear headphones around his neck, black joggers and white sneakers. A ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette. Only the figure, on a plain flat light grey background.
- `fl6_dice_s9800.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9800, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `d6_dice_s9280.png`
  - prompt: Redraw this exact picture as a clean ligne claire comic drawing. Keep the same person with exactly the same face, beard, hair, skin tone, expression, pose, clothes and objects, and the same composition and framing. Make every colour area completely flat: remove all shading, shadows, gradients, highlights, wood grain and textures. Thin, perfectly even dark-brown ink outlines. Remove the floating die completely; his open hand stays as it is. Plain flat light grey background with nothing else, no floor shadow.
- `rt7_dice_s9942.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9942, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `fl6_dice_s9800.png`; image 2 = `ref7_now_head.png` (his face as drawn once for round 7, see "His face, drawn once" above)
  - prompt: Image 1 is a drawing of a man; image 2 shows only how his head is drawn. Redraw image 1 so that his head looks exactly like the man in image 2 and is drawn in exactly the same way: the same face construction (the same simple eyes, eyebrows, nose, mouth and ears, the same hairline, short black hair and the outline of his short black beard and moustache), the same flat dark brown skin with at most one flat shadow tone, the same thin, even dark-brown outlines, at the angle of his head in image 1, with both eyes open and his whole face drawn (eyes, eyebrows, nose and mouth all visible). Keep everything else of image 1 exactly as it is: the pose, the position and size of every limb, both hands, his clothes exactly as in image 1 (a grey zip hoodie with black headphones around his neck, black joggers and white sneakers), every object and the framing. Completely flat colours, no shading, no gradients, no highlights, no texture. Plain flat light grey background.
- after: background removed with BiRefNet; his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`); trimmed and scaled (`work/tools/r6export.py`); mirrored left-right as before, WebP q88.

### `site/art/signature.webp`

Waving in his beige jacket (contact block and résumé view), from his photo.

Made from:

- `e6f_signature_lc_s8001.png`: Qwen-Image-Edit-2511 (Apache-2.0); refine of a draft; seed 8001, 20 steps, CFG 4.0, denoise 0.68, 880x1184
  - inputs: image 1 = his photo in the beige jacket (`src/assets/img/portrait.webp`)
  - prompt: Redraw image 1 as a clean ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette, a simple clean face. Keep the same man: his exact face shape, eyes, nose, mouth, beard and hairline, his dark brown skin and his very slim build, and keep the same pose, framing and clothes. He now raises his right hand beside his head in a friendly wave, open palm toward the viewer, and keeps his left hand in his jacket pocket; a warm smile. The whole figure: sand-beige cotton jacket open over a black t-shirt, dark blue jeans and brown shoes. Only the man, on a plain flat light grey background.
  - negative prompt: blurry, photo, photorealistic, shading, gradient, hatching, extra fingers, deformed hands, text, watermark
  - starts from `e6l_signature_lc_s8001.png`:
    - `e6l_signature_lc_s8001.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 8001, 8 steps, CFG 1.0, image1
      - inputs: image 1 = his photo in the beige jacket (`src/assets/img/portrait.webp`)
      - prompt: Redraw image 1 as a clean ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette, a simple clean face. Keep the same man: his exact face shape, eyes, nose, mouth, beard and hairline, his dark brown skin and his very slim build, and keep the same pose, framing and clothes. He now raises his right hand beside his head in a friendly wave, open palm toward the viewer, and keeps his left hand in his jacket pocket; a warm smile. The whole figure: sand-beige cotton jacket open over a black t-shirt, dark blue jeans and brown shoes. Only the man, on a plain flat light grey background.
      - negative prompt: blurry, photo, photorealistic, shading, gradient, hatching, extra fingers, deformed hands, text, watermark
- `rt7_signature_s9940.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9940, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `e6f_signature_lc_s8001.png`; image 2 = `ref7_now_head.png` (his face as drawn once for round 7, see "His face, drawn once" above)
  - prompt: Image 1 is a drawing of a man; image 2 shows only how his head is drawn. Redraw image 1 so that his head looks exactly like the man in image 2 and is drawn in exactly the same way: the same face construction (the same simple eyes, eyebrows, nose, mouth and ears, the same hairline, short black hair and the outline of his short black beard and moustache), the same flat dark brown skin with at most one flat shadow tone, the same thin, even dark-brown outlines, at the angle of his head in image 1. Keep everything else of image 1 exactly as it is: the pose, the position and size of every limb, both hands, his clothes exactly as in image 1 (a beige denim jacket, a black t-shirt, blue jeans and brown boots; he waves with his raised right hand), every object and the framing. Completely flat colours, no shading, no gradients, no highlights, no texture. Plain flat light grey background.
- after: background removed with BiRefNet; his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`); trimmed and scaled (`work/tools/r6export.py`), WebP q88.

### `site/art/summit.webp`

On the Bastille viewpoint above Grenoble, from behind (kept as in round 6; only its skin colour snapped to the palette).

Made from:

- `e6f_summit_lc_s8001.png`: Qwen-Image-Edit-2511 (Apache-2.0); refine of a draft; seed 8001, 20 steps, CFG 4.0, denoise 0.68, 800x1328
  - inputs: image 1 = his photo on the Bastille viewpoint, from behind (`photos-me/activities/bastille-viewpoint-back-2026.jpg`, cropped)
  - prompt: Redraw image 1 as a clean ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette, a simple clean face. Keep the same man: his exact face shape, eyes, nose, mouth, beard and hairline, his dark brown skin and his very slim build, and keep the same pose, framing and clothes. Seen from behind exactly as in image 1: grey t-shirt, red backpack, grey shorts, sandals, a climbing helmet in his left hand. He now stands on a small flat grey limestone rock instead of the terrace. Remove the terrace, the railing, the city, the mountains, the cables and the sky: only the man and the small rock under his feet, on a plain flat light grey background.
  - negative prompt: blurry, photo, photorealistic, shading, gradient, hatching, extra fingers, deformed hands, text, watermark
  - starts from `e6l_summit_lc_s8001.png`:
    - `e6l_summit_lc_s8001.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 8001, 8 steps, CFG 1.0, image1
      - inputs: image 1 = his photo on the Bastille viewpoint, from behind (`photos-me/activities/bastille-viewpoint-back-2026.jpg`, cropped)
      - prompt: Redraw image 1 as a clean ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette, a simple clean face. Keep the same man: his exact face shape, eyes, nose, mouth, beard and hairline, his dark brown skin and his very slim build, and keep the same pose, framing and clothes. Seen from behind exactly as in image 1: grey t-shirt, red backpack, grey shorts, sandals, a climbing helmet in his left hand. He now stands on a small flat grey limestone rock instead of the terrace. Remove the terrace, the railing, the city, the mountains, the cables and the sky: only the man and the small rock under his feet, on a plain flat light grey background.
      - negative prompt: blurry, photo, photorealistic, shading, gradient, hatching, extra fingers, deformed hands, text, watermark
- after: background removed with BiRefNet; his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`); trimmed and scaled (`work/tools/r6export.py`), WebP q88.

### `site/art/vb-ready.webp`

Volleyball 1/6, ready: the ball above his forehead in both hands.

Made from:

- `v6lL_ready_s9600.png`: Qwen-Image-Edit-2511 (Apache-2.0), his LoRA `azmz_qi2512.safetensors:0.6` (trained on his photos, see above), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9600, 8 steps, CFG 1.0, 832x1216
  - inputs: image 1 = `vbref-ready-pad.png` (a grey mannequin in the pose, drawn by `work/tools/vbposes.py`, own code); image 2 = his photo spiking a volleyball (`photos-me/activities/volleyball-spike-2026.jpg`, cropped)
  - prompt: Draw the man from image 2 as a full-body drawing in exactly the pose of the grey mannequin in image 1: standing, knees slightly bent, both arms raised with the elbows bent outward, both hands just above his forehead holding a white volleyball between them; both hands open with all ten fingers spread around the ball, thumbs and index fingers forming a triangle window under the ball; looking up at the ball. He wears his clothes from image 2: a light turquoise t-shirt, black sports shorts, short white socks and dark grey sneakers. Seen from the front. Drawn as a ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette. Only the man and the ball, on a plain flat light grey background.
  - negative prompt: grey mannequin, extra fingers, missing fingers, deformed hands, extra arms, shading, text, watermark
- `rt7_vb_ready_s9940.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9940, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `v6lL_ready_s9600.png`; image 2 = `ref7_now_head.png` (his face as drawn once for round 7, see "His face, drawn once" above)
  - prompt: Image 1 is a drawing of a man; image 2 shows only how his head is drawn. Redraw image 1 so that his head looks exactly like the man in image 2 and is drawn in exactly the same way: the same face construction (the same simple eyes, eyebrows, nose, mouth and ears, the same hairline, short black hair and the outline of his short black beard and moustache), the same flat dark brown skin with at most one flat shadow tone, the same thin, even dark-brown outlines, at the angle of his head in image 1. Keep everything else of image 1 exactly as it is: the pose, the position and size of every limb, both hands, his clothes exactly as in image 1 (a plain mint-green t-shirt, black sports shorts, short white socks and grey sneakers), every object and the framing. Completely flat colours, no shading, no gradients, no highlights, no texture. Plain flat light grey background. Keep the white volleyball exactly where it is.
- after: background removed with BiRefNet; his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`, and the volleyball kit: mint tee, black shorts, white socks, grey shoes); trimmed and scaled (`work/tools/r6export.py`), WebP q88.

### `site/art/vb-set.webp`

Volleyball 2/6, the set: arms extended, ten fingers.

Made from:

- `v6l_set_s9600.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9600, 8 steps, CFG 1.0, 832x1216
  - inputs: image 1 = `vbref-set-pad.png` (a grey mannequin in the pose, drawn by `work/tools/vbposes.py`, own code); image 2 = his photo spiking a volleyball (`photos-me/activities/volleyball-spike-2026.jpg`, cropped)
  - prompt: Draw the man from image 2 as a full-body drawing in exactly the pose of the grey mannequin in image 1: an overhead volleyball pass to himself, both arms extended straight up above his head, both hands open with all ten fingers spread and pointing up, thumbs and index fingers forming a triangle, a white volleyball just above his fingertips, clearly separated from them; up on his toes, looking up at the ball. He wears his clothes from image 2: a light turquoise t-shirt, black sports shorts, short white socks and dark grey sneakers. Seen from the front. Drawn as a ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette. Only the man and the ball, on a plain flat light grey background.
  - negative prompt: grey mannequin, extra fingers, missing fingers, deformed hands, extra arms, shading, text, watermark
- `rt7_vb_set_s9940.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9940, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `v6l_set_s9600.png`; image 2 = `ref7_now_head.png` (his face as drawn once for round 7, see "His face, drawn once" above)
  - prompt: Image 1 is a drawing of a man; image 2 shows only how his head is drawn. Redraw image 1 so that his head looks exactly like the man in image 2 and is drawn in exactly the same way: the same face construction (the same simple eyes, eyebrows, nose, mouth and ears, the same hairline, short black hair and the outline of his short black beard and moustache), the same flat dark brown skin with at most one flat shadow tone, the same thin, even dark-brown outlines, at the angle of his head in image 1. Keep everything else of image 1 exactly as it is: the pose, the position and size of every limb, both hands, his clothes exactly as in image 1 (a plain mint-green t-shirt, black sports shorts, short white socks and grey sneakers), every object and the framing. Completely flat colours, no shading, no gradients, no highlights, no texture. Plain flat light grey background. Keep the white volleyball exactly where it is.
- after: the drawn ball lifted out (`work/tools/r6ball.py --lift`; the page draws its own); background removed with BiRefNet; his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`, and the volleyball kit: mint tee, black shorts, white socks, grey shoes); trimmed and scaled (`work/tools/r6export.py`), WebP q88.

### `site/art/vb-approach.webp`

Volleyball 3/6, the approach (two strides on the page).

Made from:

- `v6l_approach_s9600.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9600, 8 steps, CFG 1.0, 832x1216
  - inputs: image 1 = `vbref-approach-pad.png` (a grey mannequin in the pose, drawn by `work/tools/vbposes.py`, own code); image 2 = his photo spiking a volleyball (`photos-me/activities/volleyball-spike-2026.jpg`, cropped)
  - prompt: Draw the man from image 2 as a full-body drawing in exactly the pose of the grey mannequin in image 1: his spike approach, a long running step forward, body leaning forward, both arms swung far back behind his hips, looking up. No ball in the picture. He wears his clothes from image 2: a light turquoise t-shirt, black sports shorts, short white socks and dark grey sneakers. Seen from the front. Drawn as a ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette. Only the man and the ball, on a plain flat light grey background.
  - negative prompt: grey mannequin, extra fingers, missing fingers, deformed hands, extra arms, shading, text, watermark, volleyball, ball
- `v6p_approach_s9630.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9630, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `v6l_approach_s9600.png`; image 2 = `vb_ready_crop.png` (a crop of the clean drawing around his head, enlarged to 1024 px)
  - prompt: Image 1 is a ligne claire comic drawing of a volleyball player. Image 2 shows only the head of the man who must be in it. Change only the player's skin and head: his dark brown skin on the face, neck, arms, hands and legs, and the head of image 2 (his face, short black hair and short black beard), turned the way the head in image 1 is turned. Keep everything else exactly as it is: the pose, the position and size of every limb, both hands with five fingers each, the mint t-shirt, the black shorts, the white socks and grey shoes, the framing, the thin dark-brown outlines and the flat colours. One person only. Plain flat light grey background, no floor shadow.
- `rt7_vb_approach_s9940.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9940, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `v6p_approach_s9630.png`; image 2 = `ref7_now_head.png` (his face as drawn once for round 7, see "His face, drawn once" above)
  - prompt: Image 1 is a drawing of a man; image 2 shows only how his head is drawn. Redraw image 1 so that his head looks exactly like the man in image 2 and is drawn in exactly the same way: the same face construction (the same simple eyes, eyebrows, nose, mouth and ears, the same hairline, short black hair and the outline of his short black beard and moustache), the same flat dark brown skin with at most one flat shadow tone, the same thin, even dark-brown outlines, at the angle of his head in image 1. Keep everything else of image 1 exactly as it is: the pose, the position and size of every limb, both hands, his clothes exactly as in image 1 (a plain mint-green t-shirt, black sports shorts, short white socks and grey sneakers), every object and the framing. Completely flat colours, no shading, no gradients, no highlights, no texture. Plain flat light grey background.
- after: background removed with BiRefNet; his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`, and the volleyball kit: mint tee, black shorts, white socks, grey shoes); trimmed and scaled (`work/tools/r6export.py`), WebP q88.

### `site/art/vb-takeoff.webp`

Volleyball 4/6, take-off, both arms up.

Made from:

- `v6l_takeoff_s9600.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9600, 8 steps, CFG 1.0, 832x1216
  - inputs: image 1 = `vbref-takeoff-pad.png` (a grey mannequin in the pose, drawn by `work/tools/vbposes.py`, own code); image 2 = his photo spiking a volleyball (`photos-me/activities/volleyball-spike-2026.jpg`, cropped)
  - prompt: Draw the man from image 2 as a full-body drawing in exactly the pose of the grey mannequin in image 1: the take-off of a jump, both feet planted side by side, knees deeply bent, both arms swinging up in front of him to above his head, open hands, looking up. No ball in the picture. He wears his clothes from image 2: a light turquoise t-shirt, black sports shorts, short white socks and dark grey sneakers. Seen from the front. Drawn as a ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette. Only the man and the ball, on a plain flat light grey background.
  - negative prompt: grey mannequin, extra fingers, missing fingers, deformed hands, extra arms, shading, text, watermark, volleyball, ball
- `rt7_vb_takeoff_s9940.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9940, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `v6l_takeoff_s9600.png`; image 2 = `ref7_now_head.png` (his face as drawn once for round 7, see "His face, drawn once" above)
  - prompt: Image 1 is a drawing of a man; image 2 shows only how his head is drawn. Redraw image 1 so that his head looks exactly like the man in image 2 and is drawn in exactly the same way: the same face construction (the same simple eyes, eyebrows, nose, mouth and ears, the same hairline, short black hair and the outline of his short black beard and moustache), the same flat dark brown skin with at most one flat shadow tone, the same thin, even dark-brown outlines, at the angle of his head in image 1. Keep everything else of image 1 exactly as it is: the pose, the position and size of every limb, both hands, his clothes exactly as in image 1 (a plain mint-green t-shirt, black sports shorts, short white socks and grey sneakers), every object and the framing. Completely flat colours, no shading, no gradients, no highlights, no texture. Plain flat light grey background.
- after: background removed with BiRefNet; his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`, and the volleyball kit: mint tee, black shorts, white socks, grey shoes); trimmed and scaled (`work/tools/r6export.py`), WebP q88.

### `site/art/vb-cocked.webp`

Volleyball 5/6, hitting arm cocked (from his spike photo).

Made from:

- `e6f_cocked_lc_s8001.png`: Qwen-Image-Edit-2511 (Apache-2.0); refine of a draft; seed 8001, 20 steps, CFG 4.0, denoise 0.68, 752x1392
  - inputs: image 1 = his photo spiking a volleyball (`photos-me/activities/volleyball-spike-2026.jpg`, cropped)
  - prompt: Redraw image 1 as a clean ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette, a simple clean face. Keep the same man: his exact face shape, eyes, nose, mouth, beard and hairline, his dark brown skin and his very slim build, and keep the same pose, framing and clothes. Keep his exact jumping pose: both feet off the ground, his left arm reaching up, his right arm cocked back behind his head with the hand open, light turquoise t-shirt, black shorts, white socks, dark grey sneakers. Remove the other person, the trees, the grass, the net and the ball: only him, on a plain flat light grey background.
  - negative prompt: blurry, photo, photorealistic, shading, gradient, hatching, extra fingers, deformed hands, text, watermark
  - starts from `e6l_cocked_lc_s8001.png`:
    - `e6l_cocked_lc_s8001.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 8001, 8 steps, CFG 1.0, image1
      - inputs: image 1 = his photo spiking a volleyball (`photos-me/activities/volleyball-spike-2026.jpg`, cropped)
      - prompt: Redraw image 1 as a clean ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette, a simple clean face. Keep the same man: his exact face shape, eyes, nose, mouth, beard and hairline, his dark brown skin and his very slim build, and keep the same pose, framing and clothes. Keep his exact jumping pose: both feet off the ground, his left arm reaching up, his right arm cocked back behind his head with the hand open, light turquoise t-shirt, black shorts, white socks, dark grey sneakers. Remove the other person, the trees, the grass, the net and the ball: only him, on a plain flat light grey background.
      - negative prompt: blurry, photo, photorealistic, shading, gradient, hatching, extra fingers, deformed hands, text, watermark
- `rt7_vb_cocked_s9940.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9940, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `e6f_cocked_lc_s8001.png`; image 2 = `ref7_now_head.png` (his face as drawn once for round 7, see "His face, drawn once" above)
  - prompt: Image 1 is a drawing of a man; image 2 shows only how his head is drawn. Redraw image 1 so that his head looks exactly like the man in image 2 and is drawn in exactly the same way: the same face construction (the same simple eyes, eyebrows, nose, mouth and ears, the same hairline, short black hair and the outline of his short black beard and moustache), the same flat dark brown skin with at most one flat shadow tone, the same thin, even dark-brown outlines, at the angle of his head in image 1. Keep everything else of image 1 exactly as it is: the pose, the position and size of every limb, both hands, his clothes exactly as in image 1 (a plain mint-green t-shirt, black sports shorts, short white socks and grey sneakers), every object and the framing. Completely flat colours, no shading, no gradients, no highlights, no texture. Plain flat light grey background.
- after: background removed with BiRefNet; his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`, and the volleyball kit: mint tee, black shorts, white socks, grey shoes); trimmed and scaled (`work/tools/r6export.py`), WebP q88.

### `site/art/vb-contact.webp`

Volleyball 6/6, contact at full stretch (from his spike photo).

Made from:

- `e6l_contact_lc_s8001.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 8001, 8 steps, CFG 1.0, image1
  - inputs: image 1 = his photo spiking a volleyball (`photos-me/activities/volleyball-spike-2026.jpg`, cropped)
  - prompt: Redraw image 1 as a clean ligne claire comic drawing in the style of a modern European bande dessinee: thin, perfectly even dark-brown ink outlines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette, a simple clean face. Keep the same man: his exact face shape, eyes, nose, mouth, beard and hairline, his dark brown skin and his very slim build, and keep the same pose, framing and clothes. Same jump, a moment later, at the contact of his spike: his right arm now fully extended above his head and forward, his open hand striking a white volleyball with all five fingers spread and the wrist snapping forward, his left arm pulled down to his side; both feet off the ground; light turquoise t-shirt, black shorts, white socks, dark grey sneakers. Remove the other person, the trees, the grass and the net: only him and the ball at his hand, on a plain flat light grey background.
  - negative prompt: blurry, photo, photorealistic, shading, gradient, hatching, extra fingers, deformed hands, text, watermark
- `rt7_vb_contact_s9940.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9940, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `e6l_contact_lc_s8001.png`; image 2 = `ref7_now_head.png` (his face as drawn once for round 7, see "His face, drawn once" above)
  - prompt: Image 1 is a drawing of a man; image 2 shows only how his head is drawn. Redraw image 1 so that his head looks exactly like the man in image 2 and is drawn in exactly the same way: the same face construction (the same simple eyes, eyebrows, nose, mouth and ears, the same hairline, short black hair and the outline of his short black beard and moustache), the same flat dark brown skin with at most one flat shadow tone, the same thin, even dark-brown outlines, at the angle of his head in image 1. Keep everything else of image 1 exactly as it is: the pose, the position and size of every limb, both hands, his clothes exactly as in image 1 (a plain mint-green t-shirt, black sports shorts, short white socks and grey sneakers), every object and the framing. Completely flat colours, no shading, no gradients, no highlights, no texture. Plain flat light grey background. Keep the white volleyball exactly where it is.
- after: background removed with BiRefNet; his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`, and the volleyball kit: mint tee, black shorts, white socks, grey shoes); trimmed and scaled (`work/tools/r6export.py`), WebP q88.

### `site/art/wall-steel-wide.webp`

The traverse: the riveted steel of the U4 blast furnace, wide.

Made from:

- `wall7_steel_s9920.png`: Qwen-Image-2512 (Apache-2.0); text to image; seed 9920, 40 steps, CFG 4.0, 1664x928
  - prompt: A wide, flat, front-facing drawing of a long horizontal stretch of the riveted steel plates of an old blast furnace wall, seen perfectly straight on with no perspective and no curvature: a row of large blue-grey steel plates side by side, rows of round rivets along every seam, vertical and horizontal weld seams, a few bolted brackets and one small round inspection hatch, rust-brown streaks running down as flat colour shapes. Ligne claire comic illustration in the style of a modern European bande dessinee: clean simple linework with thin, perfectly even dark-brown ink outlines, large areas of completely flat colour, no shading, no gradients, no hatching, no texture, muted warm palette. The steel fills the whole image edge to edge: no frame, no border, no sky, no ground, no people, no faces, no climbing holds, no text.
- after: its blank margins cut off, scaled to 900 px high and put next to its mirror image so it repeats sideways with no seam (`work/tools/walltile.py`), WebP q82.

### `site/art/wall-rock-wide.webp`

The traverse: the limestone above Grenoble, wide.

Made from:

- `wall7_rock_s9921.png`: Qwen-Image-2512 (Apache-2.0); text to image; seed 9921, 40 steps, CFG 4.0, 1664x928
  - prompt: A wide, flat, front-facing drawing of a long horizontal stretch of a pale limestone cliff face for bouldering, seen straight on with no perspective: cream and pale grey limestone with long vertical cracks, a few horizontal ledges and pockets, small tufts of dry grass and one small pine growing from a crack. Ligne claire comic illustration in the style of a modern European bande dessinee: clean simple linework with thin, perfectly even dark-brown ink outlines, large areas of completely flat colour, no shading, no gradients, no hatching, no texture, muted warm palette. The rock fills the whole image edge to edge: no frame, no border, no sky, no ground, no people, no faces, no climbing holds, no text.
- after: the rock face cut out of the picture (sky and ground off), scaled to 900 px high, WebP q82.

### `site/art/cl-start.webp`

The traverse, start (seen from behind; round-6 drawing, only its skin snapped to the palette).

Made from:

- `c6n_start_s9720.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9720, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `f_cl_start_s7200.png` (the round-5 climbing pose, Qwen-Image-Edit-2511, Apache-2.0; its round-5 entry is in `art/LICENSES-log.jsonl`)
  - prompt: Change two things in this ligne claire comic drawing of a climber seen from behind: make his t-shirt blue-grey, and make his body very slim, with long thin arms, a narrow waist and thin legs, as a tall lean young man. Keep everything else exactly as it is: the climbing pose, the position of every hand and foot, the size and the framing, his dark brown skin and short black hair, the olive trousers, the dark climbing shoes, the thin cord around his waist with the small grey chalk bag, the thin dark-brown outlines and the flat colours. No harness, no straps on the legs, no rope. Plain flat light grey background.
- after: scaled back to 832x1216; background removed with BiRefNet; his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`); exported with the round-5 trim box (`r6export.py --r5box`), WebP q88.

### `site/art/cl-highstep.webp`

The traverse, high step (seen from behind; round-6 drawing, only its skin snapped to the palette).

Made from:

- `c6n_highstep_s9720.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9720, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `f_cl_highstep_s7211.png` (the round-5 climbing pose, Qwen-Image-Edit-2511, Apache-2.0; its round-5 entry is in `art/LICENSES-log.jsonl`)
  - prompt: Change two things in this ligne claire comic drawing of a climber seen from behind: make his t-shirt blue-grey, and make his body very slim, with long thin arms, a narrow waist and thin legs, as a tall lean young man. Keep everything else exactly as it is: the climbing pose, the position of every hand and foot, the size and the framing, his dark brown skin and short black hair, the olive trousers, the dark climbing shoes, the thin cord around his waist with the small grey chalk bag, the thin dark-brown outlines and the flat colours. No harness, no straps on the legs, no rope. Plain flat light grey background.
- after: scaled back to 832x1216; background removed with BiRefNet; his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`); exported with the round-5 trim box (`r6export.py --r5box`), WebP q88.

### `site/art/cl-pull.webp`

The traverse, pull (seen from behind; round-6 drawing, only its skin snapped to the palette).

Made from:

- `c6n_pull_s9720.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); edit with reference images; seed 9720, 8 steps, CFG 1.0, image1
  - inputs: image 1 = `f_cl_pull_s7241.png` (the round-5 climbing pose, Qwen-Image-Edit-2511, Apache-2.0; its round-5 entry is in `art/LICENSES-log.jsonl`)
  - prompt: Change two things in this ligne claire comic drawing of a climber seen from behind: make his t-shirt blue-grey, and make his body very slim, with long thin arms, a narrow waist and thin legs, as a tall lean young man. Keep everything else exactly as it is: the climbing pose, the position of every hand and foot, the size and the framing, his dark brown skin and short black hair, the olive trousers, the dark climbing shoes, the thin cord around his waist with the small grey chalk bag, the thin dark-brown outlines and the flat colours. No harness, no straps on the legs, no rope. Plain flat light grey background.
- after: scaled back to 832x1216; background removed with BiRefNet; his skin (base and one shadow), hair, beard, lips and eye whites snapped to the one palette (`work/tools/snap7.py`); exported with the round-5 trim box (`r6export.py --r5box`), WebP q88.

## Places, walls, postcards and the knight (unchanged since round 5)

### `site/art/strasbourg.webp`

Strasbourg: the cathedral above the covered bridges and the half-timbered houses of the Petite France.

- `strasbourg_f_s6121.png`: Qwen-Image-2512 (Apache-2.0); text to image; seed 6121, 40 steps, CFG 4.0, 1664x640
  - prompt: A wide panoramic drawing of Strasbourg, France: the red sandstone Gothic cathedral with its single tall spire rising behind the half-timbered houses of the Petite France district along the river Ill, the square towers of the covered bridges, a few trees along the water. Ligne claire comic illustration in the style of a modern European bande dessinee: clean simple linework with thin, perfectly even dark-brown ink outlines, large areas of completely flat colour, no shading, no gradients, no hatching, no texture, little detail in the distance, muted warm palette. Fills: pink-red sandstone, cream, timber brown, soft blue water, sage green. No people. The drawing fills the whole image edge to edge: no frame, no border, no margin, no text. The sky is one plain flat pale grey colour with nothing in it: no clouds, no sun, no birds.
- after: the flat sky keyed out by `work/tools/skykey.py` (the page's own sky shows through); 1664 x 640, WebP q86.

### `site/art/rabat.webp`

Rabat: the Hassan Tower on the left, the columns of its esplanade, the walls of the Kasbah and the ocean.

- `rabat2_f_s6211.png`: Qwen-Image-2512 (Apache-2.0); text to image; seed 6211, 40 steps, CFG 4.0, 1664x640
  - prompt: A wide panoramic drawing of Rabat, Morocco: on the left side of the picture, about a fifth of the way in from the left edge, the tall square Hassan Tower minaret of ochre stone with its carved arches; the rows of short broken stone columns of its wide esplanade spread to the right, the walls of the Kasbah of the Udayas by the sea, white and ochre buildings, a few palm trees, a strip of the Atlantic ocean on the horizon. Ligne claire comic illustration in the style of a modern European bande dessinee: clean simple linework with thin, perfectly even dark-brown ink outlines, large areas of completely flat colour, no shading, no gradients, no hatching, no texture, little detail in the distance, muted warm palette. Fills: ochre, warm sand, white, sea blue, sage green. No people. The drawing fills the whole image edge to edge: no frame, no border, no margin, no text. The sky is one plain flat pale grey colour with nothing in it: no clouds, no sun, no birds.
- after: the thin frame the model drew was cropped off (`work/tools/deframe.py`); the flat sky keyed out by `work/tools/skykey.py` (the page's own sky shows through); 1664 x 640, WebP q86.

### `site/art/grenoble.webp`

Grenoble seen from the Bastille: rooftops, the Isère, the mountains, and the cable car's bubble cabins on the right.

- `grenoble2_f_s6231.png`: Qwen-Image-2512 (Apache-2.0); text to image; seed 6231, 40 steps, CFG 4.0, 1664x768
  - prompt: A wide panoramic drawing of Grenoble, France, seen from the Bastille: the city with its terracotta rooftops spread in the flat valley, the Isere river curving through it, the mountain ranges of Belledonne and the Vercors around the valley, and in the right foreground the cable of the Grenoble-Bastille cable car coming down from the top right corner with a small group of four round bubble-shaped cabins hanging on it, near the right edge of the picture; the left side shows only the city and the mountains. Ligne claire comic illustration in the style of a modern European bande dessinee: clean simple linework with thin, perfectly even dark-brown ink outlines, large areas of completely flat colour, no shading, no gradients, no hatching, no texture, little detail in the distance, muted warm palette. Fills: pale limestone, sage green, slate blue mountains, terracotta roofs, cream. No people. The drawing fills the whole image edge to edge: no frame, no border, no margin, no text. The sky is one plain flat pale grey colour with nothing in it: no clouds, no sun, no birds.
- after: the flat sky keyed out by `work/tools/skykey.py`; 1664 x 768, WebP q86.

### `site/art/niamey.webp`

Niamey at dawn, seen across the Niger: the town and its minaret, the bridge, a pirogue (the first screen).

- `niamey2_f_s6221.png`: Qwen-Image-2512 (Apache-2.0); text to image; seed 6221, 40 steps, CFG 4.0, 1664x640
  - prompt: A wide, calm panoramic drawing of Niamey, Niger, at dawn, seen from far across the Niger river: the far bank with the low sand-coloured town, a mosque minaret, the long low Kennedy bridge and a few small acacia and palm trees forms a thin low band across the middle of the picture; the wide calm river fills the lower part, with one small empty wooden pirogue on the water; the upper half of the picture is empty sky. Nothing tall in the foreground. Ligne claire comic illustration in the style of a modern European bande dessinee: clean simple linework with thin, perfectly even dark-brown ink outlines, large areas of completely flat colour, no shading, no gradients, no hatching, no texture, little detail in the distance, muted warm palette. Fills: warm sand, ochre, soft river blue, sage green, cream. No people. The drawing fills the whole image edge to edge: no frame, no border, no margin, no text. The sky is one plain flat pale grey colour with nothing in it: no clouds, no sun, no birds.
- after: the flat sky keyed out by `work/tools/skykey.py` (the page's own sky shows through); 1664 x 640, WebP q86.

### `site/art/card-niamey.webp`

Résumé postcard: Niamey at dawn.

- `niamey2_f_s6221.png`: Qwen-Image-2512 (Apache-2.0); text to image; seed 6221, 40 steps, CFG 4.0, 1664x640
  - prompt: A wide, calm panoramic drawing of Niamey, Niger, at dawn, seen from far across the Niger river: the far bank with the low sand-coloured town, a mosque minaret, the long low Kennedy bridge and a few small acacia and palm trees forms a thin low band across the middle of the picture; the wide calm river fills the lower part, with one small empty wooden pirogue on the water; the upper half of the picture is empty sky. Nothing tall in the foreground. Ligne claire comic illustration in the style of a modern European bande dessinee: clean simple linework with thin, perfectly even dark-brown ink outlines, large areas of completely flat colour, no shading, no gradients, no hatching, no texture, little detail in the distance, muted warm palette. Fills: warm sand, ochre, soft river blue, sage green, cream. No people. The drawing fills the whole image edge to edge: no frame, no border, no margin, no text. The sky is one plain flat pale grey colour with nothing in it: no clouds, no sun, no birds.
- after: cut by `work/tools/cards_r5.py` from the page's strip (`niamey.webp`) at x = 200 px, laid over a flat sky of its hour with a flat sun; 600 x 400, WebP q86.

### `site/art/card-rabat.webp`

Résumé postcard: Rabat in the morning.

- `rabat2_f_s6211.png`: Qwen-Image-2512 (Apache-2.0); text to image; seed 6211, 40 steps, CFG 4.0, 1664x640
  - prompt: A wide panoramic drawing of Rabat, Morocco: on the left side of the picture, about a fifth of the way in from the left edge, the tall square Hassan Tower minaret of ochre stone with its carved arches; the rows of short broken stone columns of its wide esplanade spread to the right, the walls of the Kasbah of the Udayas by the sea, white and ochre buildings, a few palm trees, a strip of the Atlantic ocean on the horizon. Ligne claire comic illustration in the style of a modern European bande dessinee: clean simple linework with thin, perfectly even dark-brown ink outlines, large areas of completely flat colour, no shading, no gradients, no hatching, no texture, little detail in the distance, muted warm palette. Fills: ochre, warm sand, white, sea blue, sage green. No people. The drawing fills the whole image edge to edge: no frame, no border, no margin, no text. The sky is one plain flat pale grey colour with nothing in it: no clouds, no sun, no birds.
- after: cut by `work/tools/cards_r5.py` from the page's strip (`rabat.webp`) at x = 0 px, laid over a flat sky of its hour with a flat sun; 600 x 400, WebP q86.

### `site/art/card-strasbourg.webp`

Résumé postcard: Strasbourg in late morning.

- `strasbourg_f_s6121.png`: Qwen-Image-2512 (Apache-2.0); text to image; seed 6121, 40 steps, CFG 4.0, 1664x640
  - prompt: A wide panoramic drawing of Strasbourg, France: the red sandstone Gothic cathedral with its single tall spire rising behind the half-timbered houses of the Petite France district along the river Ill, the square towers of the covered bridges, a few trees along the water. Ligne claire comic illustration in the style of a modern European bande dessinee: clean simple linework with thin, perfectly even dark-brown ink outlines, large areas of completely flat colour, no shading, no gradients, no hatching, no texture, little detail in the distance, muted warm palette. Fills: pink-red sandstone, cream, timber brown, soft blue water, sage green. No people. The drawing fills the whole image edge to edge: no frame, no border, no margin, no text. The sky is one plain flat pale grey colour with nothing in it: no clouds, no sun, no birds.
- after: cut by `work/tools/cards_r5.py` from the page's strip (`strasbourg.webp`) at x = 230 px, laid over a flat sky of its hour with a flat sun; 600 x 400, WebP q86.

### `site/art/card-uckange.webp`

Résumé postcard: the U4 blast furnace at Uckange at midday.

- `card_uckange_f_s6162.png`: Qwen-Image-2512 (Apache-2.0); text to image; seed 6162, 40 steps, CFG 4.0, 1584x1056
  - prompt: A wide landscape drawing of the preserved U4 blast furnace at Uckange, France, seen from a distance at midday: the tall blast furnace, a tapering steel furnace shell wrapped in a dark steel framework with gangways and stairs, topped by large curved gas pipes, an inclined skip bridge rising to its top, and tall cylindrical hot-blast stoves beside it, standing on the right of the picture in a flat landscape with a few low steel-plant buildings, a rail track and a road in the foreground, a pale cream noon sky with a small flat pale-yellow sun. Ligne claire comic illustration in the style of a modern European bande dessinee: clean simple linework with thin, perfectly even dark-brown ink outlines, large areas of completely flat colour, no shading, no gradients, no hatching, no texture, little detail in the distance, muted warm palette. No people. The drawing fills the whole image edge to edge: no frame, no border, no margin, no text.
- after: the thin frame the model drew was cropped off (`work/tools/deframe.py`), cut to 3:2; 600 x 400, WebP q86.

### `site/art/card-grenoble.webp`

Résumé postcard: Grenoble at night from the Bastille, the cable car's lit cabins.

- `card_grenoble_f_s6171.png`: Qwen-Image-2512 (Apache-2.0); text to image; seed 6171, 40 steps, CFG 4.0, 1584x1056
  - prompt: A wide landscape drawing of Grenoble, France, seen from the Bastille at night: a deep blue-black night sky with a few small stars and a thin crescent moon, the mountains as dark flat silhouettes, the city below in the valley lit by many small warm gold windows and street lights, and the cable of the Bastille cable car crossing the foreground with two small lit round bubble-shaped cabins. Ligne claire comic illustration in the style of a modern European bande dessinee: clean simple linework with thin, perfectly even dark-brown ink outlines, large areas of completely flat colour, no shading, no gradients, no hatching, no texture, little detail in the distance, muted warm palette. No people. The drawing fills the whole image edge to edge: no frame, no border, no margin, no text.
- after: the thin frame the model drew was cropped off (`work/tools/deframe.py`), cut to 3:2; 600 x 400, WebP q86.

### `site/art/knight.webp`

The knight that makes the knight's move from Niamey to Rabat.

- `knight_f_s6181.png`: Qwen-Image-2512 (Apache-2.0); text to image; seed 6181, 40 steps, CFG 4.0, 1024x1024
  - prompt: A single white chess knight piece, the classic Staunton horse head on a round turned base, standing upright, three-quarter view facing left, the whole piece in the picture with space around it. Ligne claire comic illustration in the style of a modern European bande dessinee: clean simple linework with thin, perfectly even dark-brown ink outlines, large areas of completely flat colour, no shading, no gradients, no hatching, no texture, little detail in the distance, muted warm palette. Cream-white fill with a pale warm-grey shade plane, dark-brown outlines. No board, no other pieces, no people, no text. Plain flat light grey background, no shadow.
- after: background removed with BiRefNet (birefnet-general, through rembg); trimmed, 400 px high, WebP q88.

## His own assets (not generated)

- `coilcheck.webp`, `remind.webp`, `rollpower.webp`, `zktris.webp`, `projects/txbot.webp`, `projects/remind-full.webp`,
  `projects/coilcheck-tight.webp`: screenshots and figures of his own projects, copied from his portfolio.
- `crown.svg`, `crown-180.png`: his ZTK crown logo.


## Appendix: round-5 parents of the climbing poses (from `art/LICENSES-log.jsonl`)

`head_anchor.png` is `head_f_s5121.png`, drawn from his headshot through `anchor_s5001.png`. `photo_headshot.jpg` is his headshot photo (`src/assets/img/headshot.jpg`).

- `d2_cl_start_s7200.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); seed 7200, 8 steps, CFG 1, 832x1216
  - inputs: `head_anchor.png`, `photo_headshot.jpg`
  - prompt: Full-body back view of the man from image 1 (the same face as image 1 and the photo image 2: short black hair, short full black beard, dark brown skin, slim build) climbing, seen from directly behind: his back faces the viewer, we see the back of his head with its short black hair, his face is hidden. He is bouldering, so he wears no harness: a plain fitted mid-grey t-shirt, plain olive-green trousers with nothing around the thighs, a small grey chalk bag tied at the back of his waist by a thin cord, and dark climbing shoes. The whole figure from his hands to his feet is in the picture. Pose: the start: both hands raised to the height of his face, a little wider than his shoulders, fingers curled in a grip, arms slightly bent; both feet low at the height of his knees, legs apart, knees slightly bent, body upright. Drawn in exactly the same style as image 1: ligne claire, thin perfectly even dark-brown ink contour lines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette, a modern European comic drawing. Only the figure, alone on a plain flat light grey background.
- `f_cl_start_s7200.png`: Qwen-Image-Edit-2511 (Apache-2.0); seed 7200, 18 steps, CFG 4, refine of `d2_cl_start_s7200.png` (denoise 0.68), 832x1216
  - inputs: `head_anchor.png`, `photo_headshot.jpg`
  - prompt: Full-body back view of the man from image 1 (the same face as image 1 and the photo image 2: short black hair, short full black beard, dark brown skin, slim build) climbing, seen from directly behind: his back faces the viewer, we see the back of his head with its short black hair, his face is hidden. He is bouldering, so he wears no harness: a plain fitted mid-grey t-shirt, plain olive-green trousers with nothing around the thighs, a small grey chalk bag tied at the back of his waist by a thin cord, and dark climbing shoes. The whole figure from his hands to his feet is in the picture. Pose: the start: both hands raised to the height of his face, a little wider than his shoulders, fingers curled in a grip, arms slightly bent; both feet low at the height of his knees, legs apart, knees slightly bent, body upright. Drawn in exactly the same style as image 1: ligne claire, thin perfectly even dark-brown ink contour lines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette, a modern European comic drawing. Only the figure, alone on a plain flat light grey background.
- `d2_cl_highstep_s7211.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); seed 7211, 8 steps, CFG 1, 832x1216
  - inputs: `head_anchor.png`, `photo_headshot.jpg`
  - prompt: Full-body back view of the man from image 1 (the same face as image 1 and the photo image 2: short black hair, short full black beard, dark brown skin, slim build) climbing, seen from directly behind: his back faces the viewer, we see the back of his head with its short black hair, his face is hidden. He is bouldering, so he wears no harness: a plain fitted mid-grey t-shirt, plain olive-green trousers with nothing around the thighs, a small grey chalk bag tied at the back of his waist by a thin cord, and dark climbing shoes. The whole figure from his hands to his feet is in the picture. Pose: a high step: both hands just above his shoulders with fingers curled in a grip; his left foot raised high and wide to the side at the height of his hip, the left knee bent up; his right leg straight below. Drawn in exactly the same style as image 1: ligne claire, thin perfectly even dark-brown ink contour lines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette, a modern European comic drawing. Only the figure, alone on a plain flat light grey background.
- `f_cl_highstep_s7211.png`: Qwen-Image-Edit-2511 (Apache-2.0); seed 7211, 18 steps, CFG 4, refine of `d2_cl_highstep_s7211.png` (denoise 0.68), 832x1216
  - inputs: `head_anchor.png`, `photo_headshot.jpg`
  - prompt: Full-body back view of the man from image 1 (the same face as image 1 and the photo image 2: short black hair, short full black beard, dark brown skin, slim build) climbing, seen from directly behind: his back faces the viewer, we see the back of his head with its short black hair, his face is hidden. He is bouldering, so he wears no harness: a plain fitted mid-grey t-shirt, plain olive-green trousers with nothing around the thighs, a small grey chalk bag tied at the back of his waist by a thin cord, and dark climbing shoes. The whole figure from his hands to his feet is in the picture. Pose: a high step: both hands just above his shoulders with fingers curled in a grip; his left foot raised high and wide to the side at the height of his hip, the left knee bent up; his right leg straight below. Drawn in exactly the same style as image 1: ligne claire, thin perfectly even dark-brown ink contour lines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette, a modern European comic drawing. Only the figure, alone on a plain flat light grey background.
- `d2_cl_pull_s7241.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); seed 7241, 8 steps, CFG 1, 832x1216
  - inputs: `head_anchor.png`, `photo_headshot.jpg`
  - prompt: Full-body back view of the man from image 1 (the same face as image 1 and the photo image 2: short black hair, short full black beard, dark brown skin, slim build) climbing, seen from directly behind: his back faces the viewer, we see the back of his head with its short black hair, his face is hidden. He is bouldering, so he wears no harness: a plain fitted mid-grey t-shirt, plain olive-green trousers with nothing around the thighs, a small grey chalk bag tied at the back of his waist by a thin cord, and dark climbing shoes. The whole figure from his hands to his feet is in the picture. Pose: a pull-up: both hands above his head with fingers curled in a grip, elbows bent at shoulder height as he pulls himself up; his right foot raised to knee height; his left leg slightly bent below. Drawn in exactly the same style as image 1: ligne claire, thin perfectly even dark-brown ink contour lines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette, a modern European comic drawing. Only the figure, alone on a plain flat light grey background.
- `f_cl_pull_s7241.png`: Qwen-Image-Edit-2511 (Apache-2.0); seed 7241, 18 steps, CFG 4, refine of `d2_cl_pull_s7241.png` (denoise 0.68), 832x1216
  - inputs: `head_anchor.png`, `photo_headshot.jpg`
  - prompt: Full-body back view of the man from image 1 (the same face as image 1 and the photo image 2: short black hair, short full black beard, dark brown skin, slim build) climbing, seen from directly behind: his back faces the viewer, we see the back of his head with its short black hair, his face is hidden. He is bouldering, so he wears no harness: a plain fitted mid-grey t-shirt, plain olive-green trousers with nothing around the thighs, a small grey chalk bag tied at the back of his waist by a thin cord, and dark climbing shoes. The whole figure from his hands to his feet is in the picture. Pose: a pull-up: both hands above his head with fingers curled in a grip, elbows bent at shoulder height as he pulls himself up; his right foot raised to knee height; his left leg slightly bent below. Drawn in exactly the same style as image 1: ligne claire, thin perfectly even dark-brown ink contour lines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette, a modern European comic drawing. Only the figure, alone on a plain flat light grey background.
- `head_f_s5121.png`: Qwen-Image-Edit-2511 (Apache-2.0); seed 5121, 40 steps, CFG 4, 1024x1024
  - inputs: `anchor_s5001.png`, `photo_headshot.jpg`
  - prompt: Head-and-shoulders portrait drawing of the man in image 1, cropped at the chest, front view, looking at the viewer with a calm, slight closed-mouth smile. Keep his drawn face from image 1 and make it match the photo image 2 closely: long oval face, high forehead, short black hair, short full black beard and moustache, dark brown skin. He wears a plain black crew-neck t-shirt. Drawn in exactly the same style as image 1: ligne claire, thin perfectly even dark-brown ink contour lines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette, a modern European comic drawing. Plain flat light grey background, nothing else in the image.
- `anchor_s5001.png`: Qwen-Image-Edit-2511 (Apache-2.0); seed 5001, 40 steps, CFG 4, 832x1216
  - inputs: `headshot.jpg`, `portrait-cutout.webp`
  - prompt: Redraw the man from image 1 and image 2 as a clean ligne claire illustration: a full-body drawing of him standing, front view, relaxed, arms by his sides, in his own clothes from image 2 (beige cotton jacket, black t-shirt, dark blue jeans, brown leather shoes). Keep his face, his short black hair, his short full black beard, his slim build and his dark brown skin exactly like the photos. Style: thin perfectly even dark-brown ink contour lines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette, a modern European comic drawing. Plain flat light grey background, nothing else in the image.
- `draft_anchor_s5001.png`: Qwen-Image-Edit-2511 (Apache-2.0), Lightning LoRA Qwen-Image-Edit-2511-Lightning-8steps-V1.0-bf16.safetensors (lightx2v, Apache-2.0); seed 5001, 8 steps, CFG 1, 832x1216
  - inputs: `headshot.jpg`, `portrait-cutout.webp`
  - prompt: Redraw the man from image 1 and image 2 as a clean ligne claire illustration: a full-body drawing of him standing, front view, relaxed, arms by his sides, in his own clothes from image 2 (beige cotton jacket, black t-shirt, dark blue jeans, brown leather shoes). Keep his face, his short black hair, his short full black beard, his slim build and his dark brown skin exactly like the photos. Style: thin perfectly even dark-brown ink contour lines, completely flat colour fills, no shading, no gradients, no hatching, no texture, muted warm palette, a modern European comic drawing. Plain flat light grey background, nothing else in the image.

#!/usr/bin/env bash
# Converts the ten checked-in Mochi ADPCM WAV files in place to PCM 16-bit WAV.
set -euo pipefail

animations=(
  mochi_001 mochi_002 mochi_003 mochi_004 mochi_005
  mochi_006 mochi_007 mochi_008 mochi_009 mochi_010
)

for animation in "${animations[@]}"; do
  file="mochi_assets/${animation}/audio_${animation}/${animation}.wav"
  temp="${file%.wav}.pcm.tmp.wav"

  if [[ ! -f "$file" ]]; then
    echo "Missing audio file: $file" >&2
    exit 1
  fi

  echo "Converting $file"
  ffmpeg -hide_banner -loglevel error -y \
    -i "$file" \
    -map_metadata 0 \
    -c:a pcm_s16le \
    -ar 16000 \
    -ac 1 \
    "$temp"

  codec="$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 "$temp")"
  sample_rate="$(ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate -of default=noprint_wrappers=1:nokey=1 "$temp")"
  channels="$(ffprobe -v error -select_streams a:0 -show_entries stream=channels -of default=noprint_wrappers=1:nokey=1 "$temp")"

  if [[ "$codec" != "pcm_s16le" || "$sample_rate" != "16000" || "$channels" != "1" ]]; then
    echo "Validation failed for $file: codec=$codec rate=$sample_rate channels=$channels" >&2
    rm -f "$temp"
    exit 1
  fi

  mv "$temp" "$file"
  echo "OK: $file ($codec, ${sample_rate} Hz, mono)"
done

echo "All 10 Mochi audio files converted and validated."

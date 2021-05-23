# Media Stream Server

put tracks in a known folder:

```sh
mkdir music
# track1.mp3
# track2.mp3
# track3.mp3
```

deploy with:

```sh
docker build . -t stream
docker run -v music:/usr/src/app/music -p 8000:8000 -d stream
```

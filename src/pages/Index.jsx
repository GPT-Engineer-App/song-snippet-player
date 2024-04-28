import { useState } from "react";
import { Box, Button, Heading, Input, Stack, Text, Image, Flex, Spacer } from "@chakra-ui/react";
import { FaSearch, FaPlay, FaPause } from "react-icons/fa";

const CLIENT_ID = "4642e3fdf761477991140a71ec36597e";
const CLIENT_SECRET = "1f1ef85b93cc467290f77cdcca6b5cd1";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrackId, setPlayingTrackId] = useState("");
  const [audioPlayer, setAudioPlayer] = useState(null);

  const getAccessToken = async () => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();
    setAccessToken(data.access_token);
  };

  const searchSongs = async () => {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=10`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    setSearchResults(data.tracks.items);
  };

  const playPreview = (trackId, previewUrl) => {
    if (audioPlayer) {
      audioPlayer.pause();
    }

    const audio = new Audio(previewUrl);
    audio.play();
    setAudioPlayer(audio);
    setPlayingTrackId(trackId);
  };

  const pausePreview = () => {
    if (audioPlayer) {
      audioPlayer.pause();
      setPlayingTrackId("");
    }
  };

  return (
    <Box p={8}>
      <Heading as="h1" size="xl" mb={8}>
        Spotify Song Search
      </Heading>
      <Stack spacing={4} mb={8}>
        <Input placeholder="Search for a song" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <Button
          leftIcon={<FaSearch />}
          onClick={() => {
            if (!accessToken) {
              getAccessToken();
            }
            searchSongs();
          }}
        >
          Search
        </Button>
      </Stack>
      <Stack spacing={4}>
        {searchResults.map((track) => (
          <Box key={track.id} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
            <Flex align="center">
              <Image src={track.album.images[2].url} alt={track.album.name} mr={4} />
              <Box>
                <Text fontWeight="bold">{track.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  {track.artists.map((artist) => artist.name).join(", ")}
                </Text>
              </Box>
              <Spacer />
              {track.id === playingTrackId ? (
                <Button leftIcon={<FaPause />} size="sm" onClick={() => pausePreview()}>
                  Pause
                </Button>
              ) : (
                <Button leftIcon={<FaPlay />} size="sm" onClick={() => playPreview(track.id, track.preview_url)}>
                  Play
                </Button>
              )}
            </Flex>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Index;

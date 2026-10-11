import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Switch,
  Alert,
  Platform,
  RefreshControl,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MovieCard, { Movie } from "./components/MovieCard";

export const API_URL = "https://6aca535f3115bcc95820baf3.mockapi.io/movies";

// Hàm gọi API (GET) --- GIỮ NGUYÊN, không xoá.
export async function fetchMovies() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error("Gọi API thất bại: " + res.status);
  }
  return res.json();
}

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const [posterMode, setPosterMode] = useState<boolean>(false); // "Dạng poster"
  const [onlyUnwatched, setOnlyUnwatched] = useState<boolean>(false); // "Chưa xem"

  // Tải dữ liệu lần đầu / bấm "Thử lại"
  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data: Movie[] = await fetchMovies();
      setMovies(data);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Kéo để làm mới: không đụng tới posterMode / onlyUnwatched nên được giữ nguyên
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data: Movie[] = await fetchMovies();
      setMovies(data);
      setError(false);
    } catch (e) {
      setError(true);
    } finally {
      setRefreshing(false); // luôn tắt vòng xoay, kể cả khi lỗi
    }
  }, []);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  const filteredMovies = useMemo(
    () => (onlyUnwatched ? movies.filter((m) => !m.watched) : movies),
    [movies, onlyUnwatched]
  );

  const handleSelect = useCallback(
    (id: string) => {
      const movie = movies.find((m) => m.id === id);
      if (!movie) return;
      const message = "Đạo diễn: " + movie.director;
      if (Platform.OS === "web") {
        // Alert.alert không hiện trên tab Web của Snack
        window.alert(movie.title + "\n" + message);
      } else {
        Alert.alert(movie.title, message);
      }
    },
    [movies]
  );

  const renderItem = useCallback(
    ({ item }: { item: Movie }) =>
      posterMode ? (
        // ô bọc: mỗi ô chiếm tối đa 50% => thẻ lẻ cuối không bị kéo giãn
        <View style={styles.cell}>
          <MovieCard movie={item} onSelect={handleSelect} layout="poster" />
        </View>
      ) : (
        <MovieCard movie={item} onSelect={handleSelect} layout="row" />
      ),
    [posterMode, handleSelect]
  );

  const header = (
    <>
      <Text style={styles.heading}>Movie Watchlist</Text>
      <View style={styles.switchRow}>
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>Dạng poster</Text>
          <Switch value={posterMode} onValueChange={setPosterMode} />
        </View>
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>Chưa xem</Text>
          <Switch value={onlyUnwatched} onValueChange={setOnlyUnwatched} />
        </View>
      </View>
    </>
  );

  let body: React.ReactNode;
  if (loading) {
    body = <ActivityIndicator size="large" style={styles.center} />;
  } else if (error) {
    body = (
      <View style={styles.center}>
        <Text style={styles.errorText}>Không tải được danh sách phim.</Text>
        <Pressable style={styles.retryBtn} onPress={loadMovies}>
          <Text style={styles.retryText}>Thử lại</Text>
        </Pressable>
      </View>
    );
  } else {
    body = (
      <FlatList
        // đổi key khi đổi numColumns, nếu không FlatList báo lỗi
        key={posterMode ? "grid-2" : "list-1"}
        data={filteredMovies}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={posterMode ? 2 : 1}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có phim nào để hiển thị.</Text>
        }
      />
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        {header}
        {body}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f4f6fb" },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: "#14307f",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccd",
  },
  switchItem: { flexDirection: "row", alignItems: "center" },
  switchLabel: { marginRight: 8, color: "#556" },
  listContent: { paddingTop: 10, paddingHorizontal: 0, paddingBottom: 20, flexGrow: 1 },
  cell: { flex: 1, maxWidth: "50%", padding: 6 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 16, marginBottom: 12 },
  retryBtn: {
    backgroundColor: "#14307f",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: "#fff", fontWeight: "700" },
  emptyText: { textAlign: "center", color: "#667", marginTop: 40, fontSize: 15 },
});

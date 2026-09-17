import { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  ImageResizeMode,
  ImageSourcePropType,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  image: ImageSourcePropType;
};

const PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'The Legend of Zelda: Tears of the Kingdom',
    price: 64999,
    description: 'Aventura de mundo abierto para Nintendo Switch. Continuación directa de Breath of the Wild.',
    // Reemplazá esto por una foto tuya en /assets/products y usá require('./assets/products/tu-imagen.jpg')
    image: require('./assets/products/portada-local.jpg'),
  },
  {
    id: '2',
    title: 'Elden Ring',
    price: 54999,
    description: 'RPG de acción y mundo abierto desarrollado por FromSoftware, disponible para PS5 y Xbox Series.',
    image: { uri: 'https://en.wikipedia.org/wiki/Special:FilePath/Elden%20Ring%20Box%20art.jpg' },
  },
  {
    id: '3',
    title: 'God of War Ragnarök',
    price: 49999,
    description: 'Kratos y Atreus enfrentan el Ragnarök en esta secuela para PlayStation 5.',
    image: { uri: 'https://en.wikipedia.org/wiki/Special:FilePath/God%20of%20War%20Ragnar%C3%B6k%20cover.jpg' },
  },
  {
    id: '4',
    title: 'FIFA 27',
    price: 39999,
    description: 'Simulador de fútbol con licencias oficiales, disponible para todas las plataformas.',
    image: { uri: 'https://en.wikipedia.org/wiki/Special:FilePath/FC%2027%20Cover.png' },
  },
  {
    id: '5',
    title: 'Mario Kart 8 Deluxe',
    price: 44999,
    description: 'El clásico de carreras de Nintendo, con todos los circuitos y personajes.',
    image: { uri: 'https://en.wikipedia.org/wiki/Special:FilePath/MarioKart8Boxart.jpg' },
  },
  {
    id: '6',
    title: 'Minecraft',
    price: 19999,
    description: 'El sandbox de construcción y supervivencia más vendido de la historia.',
    image: { uri: 'https://en.wikipedia.org/wiki/Special:FilePath/Caves%20%26%20Cliffs%20II%20-%20Alex%20%26%20Steve%20I.png' },
  },
  {
    id: '7',
    title: 'Cyberpunk 2077',
    price: 34999,
    description: 'RPG futurista de mundo abierto ambientado en Night City, con la expansión Phantom Liberty.',
    image: { uri: 'https://en.wikipedia.org/wiki/Special:FilePath/Cyberpunk%202077%20box%20art.jpg' },
  },
];

const RESIZE_MODES: ImageResizeMode[] = ['cover', 'contain', 'stretch'];

function formatPrice(value: number) {
  return `$${value.toLocaleString('es-AR')}`;
}

function ResizeModeButtons({
  value,
  onChange,
}: {
  value: ImageResizeMode;
  onChange: (mode: ImageResizeMode) => void;
}) {
  return (
    <View style={styles.resizeRow}>
      {RESIZE_MODES.map((mode) => (
        <Pressable
          key={mode}
          style={[styles.resizeButton, value === mode && styles.resizeButtonActive]}
          onPress={() => onChange(mode)}
        >
          <Text style={[styles.resizeButtonText, value === mode && styles.resizeButtonTextActive]}>
            {mode}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function DetailModal({
  visible,
  product,
  onClose,
}: {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
}) {
  const [resizeMode, setResizeMode] = useState<ImageResizeMode>('cover');

  if (!product) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.imageFrame}>
            <Image source={product.image} style={styles.detailImage} resizeMode={resizeMode} />
          </View>

          <Text style={styles.detailTitle}>{product.title}</Text>
          <Text style={styles.detailPrice}>{formatPrice(product.price)}</Text>
          <Text style={styles.detailDescription}>{product.description}</Text>

          <Text style={styles.resizeLabel}>resizeMode</Text>
          <ResizeModeButtons value={resizeMode} onChange={setResizeMode} />

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function ProductCard({
  product,
  isFavorite,
  onPress,
  onLongPress,
}: {
  product: Product;
  isFavorite: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        isFavorite && styles.cardFavorite,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
    >
      <Image source={product.image} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{product.title}</Text>
        <Text style={styles.cardPrice}>{formatPrice(product.price)}</Text>
      </View>
      {isFavorite && <Text style={styles.favoriteIcon}>★</Text>}
    </Pressable>
  );
}

export default function App() {
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredProducts = useMemo(
    () => PRODUCTS.filter((p) => p.title.toLowerCase().includes(search.trim().toLowerCase())),
    [search],
  );

  function openDetail(product: Product) {
    setSelectedProduct(product);
    setModalVisible(true);
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Galería</Text>
          <Text style={styles.subtitle}>
            {filteredProducts.length} juego{filteredProducts.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por título..."
            placeholderTextColor="#7c879a"
            autoCapitalize="none"
          />
        </View>

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              isFavorite={favorites.includes(item.id)}
              onPress={() => openDetail(item)}
              onLongPress={() => toggleFavorite(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Sin resultados</Text>
              <Text style={styles.emptyText}>Probá con otro título.</Text>
            </View>
          }
        />

        <DetailModal
          visible={modalVisible}
          product={selectedProduct}
          onClose={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0f172a' },

  header: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#94a3b8', fontSize: 14, marginTop: 4 },

  searchWrapper: { paddingHorizontal: 18, paddingBottom: 12 },
  searchInput: {
    height: 48,
    color: '#fff',
    backgroundColor: '#1e293b',
    borderColor: '#475569',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
  },

  list: { paddingHorizontal: 14, paddingBottom: 40 },
  row: { justifyContent: 'space-between', marginBottom: 12 },

  card: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardFavorite: { borderColor: '#f6b93b' },
  cardPressed: { opacity: 0.8 },
  cardImage: { width: '100%', height: 120, backgroundColor: '#0f172a' },
  cardContent: { padding: 10, gap: 4 },
  cardTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  cardPrice: { color: '#476df5', fontSize: 14, fontWeight: '800' },
  favoriteIcon: { position: 'absolute', top: 8, right: 10, color: '#f6b93b', fontSize: 20 },

  empty: { alignItems: 'center', paddingTop: 60, gap: 6 },
  emptyTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  emptyText: { color: '#94a3b8', fontSize: 13 },

  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(2,6,23,.82)',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    gap: 8,
  },
  imageFrame: { width: '100%', height: 220, backgroundColor: '#0f172a', borderRadius: 14, overflow: 'hidden' },
  detailImage: { width: '100%', height: '100%' },
  detailTitle: { color: '#172033', fontSize: 21, fontWeight: '800', marginTop: 6 },
  detailPrice: { color: '#476df5', fontSize: 18, fontWeight: '800' },
  detailDescription: { color: '#475569', fontSize: 14, textAlign: 'center', marginTop: 4 },

  resizeLabel: { color: '#94a3b8', fontSize: 12, marginTop: 10 },
  resizeRow: { flexDirection: 'row', gap: 8 },
  resizeButton: { borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  resizeButtonActive: { backgroundColor: '#476df5', borderColor: '#476df5' },
  resizeButtonText: { color: '#475569', fontSize: 13, fontWeight: '600' },
  resizeButtonTextActive: { color: '#fff' },

  closeButton: { backgroundColor: '#476df5', borderRadius: 10, padding: 13, alignItems: 'center', width: '100%', marginTop: 14 },
  closeButtonText: { color: '#fff', fontWeight: '700' },
});

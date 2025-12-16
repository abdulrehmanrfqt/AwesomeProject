import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom },
      ]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Header />
        <PriceSection />
        <ChartPlaceholder />
        <TimeframeSelector />
        <BuySellLeverageRow />
        <MarketAndBalanceRow />
        <AmountInput />
        <SliderDots />
        <PositionsTabs />
        {[1].map(i => (
          <PositionCard key={i} />
        ))}
      </ScrollView>
    </View>
  );
}

function Header() {
  return (
    <View style={styles.headerRow}>
      <TouchableOpacity style={styles.circleButton}>
        <Text style={styles.circleButtonText}>{'<'}</Text>
      </TouchableOpacity>

      <View style={styles.pairContainer}>
        <View style={styles.coinIcon}>
          <Text style={styles.coinIconText}>฿</Text>
        </View>
        <Text style={styles.pairText}>BTC / USDT</Text>
      </View>

      <TouchableOpacity style={styles.circleButton}>
        <Text style={styles.circleButtonText}>{'≡'}</Text>
      </TouchableOpacity>
    </View>
  );
}

function PriceSection() {
  return (
    <View style={styles.priceSection}>
      <Text style={styles.priceText}>$90,467.87</Text>
      <Text style={styles.priceChangeText}>↑ 6.58%</Text>
    </View>
  );
}

function ChartPlaceholder() {
  const generateChartData = () => {
    const dataPoints = 40;
    const data = [];
    let baseValue = 25;
    
    for (let i = 0; i < dataPoints; i++) {
      const volatility = (Math.random() - 0.5) * 20;
      const trend = (i / dataPoints) * 50;
      const wave = Math.sin(i * 0.3) * 8;
      baseValue = baseValue + volatility * 0.4 + trend / dataPoints + wave * 0.2;
      data.push(Math.max(15, Math.min(95, baseValue)));
    }
    
    return data;
  };

  const chartData = generateChartData();
  const screenWidth = Dimensions.get('window').width - 0;

  return (
    <View style={styles.chartContainer}>
      <LineChart
        data={{
          labels: chartData.map(() => ''), // Empty labels
          datasets: [
            {
              data: chartData,
            },
          ],
        }}
        width={screenWidth}
        height={160}
        withHorizontalLabels={false}
        withVerticalLabels={false}
        withInnerLines={false}
        withOuterLines={false}
        withDots={false}
        withShadow={false}
        chartConfig={{
          backgroundColor: '#071124',
          backgroundGradientFrom: '#071124',
          backgroundGradientTo: '#071124',
          decimalPlaces: 0,
          color: () => '#00ff6a', // Neon green
          labelColor: () => 'transparent',
          strokeWidth: 2,
          propsForDots: {
            r: '0',
          },
          propsForBackgroundLines: {
            strokeWidth: 0,
          },
        }}
        bezier
        style={styles.chart}
      />
      {/* <View style={styles.chartDot} /> */}
    </View>
  );
}

function TimeframeSelector() {
  const [activeLabel, setActiveLabel] = useState('15m');
  const labels = ['1m', '15m', '1h', '1d', '1w', '1M'];

  return (
    <View style={styles.segmentRow}>
      {labels.map(label => {
        const isActive = label === activeLabel;
        return (
          <TouchableOpacity
            key={label}
            style={[styles.segmentItem, isActive && styles.segmentItemActive]}
            onPress={() => setActiveLabel(label)}>
            <Text
              style={[
                styles.segmentText,
                isActive && styles.segmentTextActive,
              ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function BuySellLeverageRow() {
  const [selectedMode, setSelectedMode] = useState<'buy' | 'sell'>('buy');

  return (
    <View style={styles.rowBetween}>
      <View style={styles.buySellContainer}>
        <TouchableOpacity
          style={[styles.buyButton, selectedMode === 'buy' && styles.buyButtonActive]}
          onPress={() => setSelectedMode('buy')}>
          <Text style={selectedMode === 'buy' ? styles.buySellTextActive : styles.buySellText}>
            Buy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sellButton, selectedMode === 'sell' && styles.sellButtonActive]}
          onPress={() => setSelectedMode('sell')}>
          <Text style={selectedMode === 'sell' ? styles.buySellTextActive : styles.buySellText}>
            Sell
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.leverageButton}>
        <Text style={styles.leverageText}>100x ▼</Text>
      </TouchableOpacity>
    </View>
  );
}

function MarketAndBalanceRow() {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');

  return (
    <View style={[styles.rowBetween, styles.marketRow]}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => setOrderType('market')}>
          <Text
            style={
              orderType === 'market'
                ? styles.marketActive
                : styles.marketInactive
            }>
            Market
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setOrderType('limit')}>
          <Text
            style={
              orderType === 'limit'
                ? styles.limitActive
                : styles.limitInactive
            }>
            Limit
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Available</Text>
        <Text style={styles.balanceValue}>2,965.65 USDT</Text>
      </View>
    </View>
  );
}

function AmountInput() {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.inputPlaceholder}
        placeholder="Enter Amount"
        placeholderTextColor={styles.inputPlaceholder.color}
        keyboardType="numeric"
      />
      <Text style={styles.inputSuffix}>BTC ▾</Text>
    </View>
  );
}

function SliderDots() {
  return (
    <View style={styles.sliderRow}>
      {[0, 1, 2, 3, 4].map(i => (
        <View key={i} style={styles.sliderDot} />
      ))}
    </View>
  );
}

function PositionsTabs() {
  const [activeTab, setActiveTab] = useState<'positions' | 'orders' | 'hideOthers'>(
    'positions',
  );

  return (
    <View style={styles.tabsRow}>
      <TouchableOpacity onPress={() => setActiveTab('positions')}>
        <Text
          style={
            activeTab === 'positions' ? styles.tabActive : styles.tabInactive
          }>
          Positions (1)
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setActiveTab('orders')}>
        <Text
          style={
            activeTab === 'orders' ? styles.tabActive : styles.tabInactive
          }>
          Open Orders
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setActiveTab('hideOthers')}>
        <Text
          style={
            activeTab === 'hideOthers' ? styles.tabActive : styles.tabInactive
          }>
          Hide Other Pairs
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function PositionCard() {
  return (
    <View style={styles.positionCard}>
      <View style={styles.positionHeader}>
        <View style={styles.pairContainer}>
          <View style={styles.coinIconSmall}>
            <Text style={styles.coinIconText}>฿</Text>
          </View>
          <Text style={styles.positionPairText}>BTCUSDT</Text>
        </View>
        <View style={styles.positionMeta}>
          <Text style={styles.longText}>Long</Text>
          <Text style={styles.metaDivider}>·</Text>
          <Text style={styles.metaText}>100x</Text>
        </View>
      </View>

      <View style={styles.positionRow}>
        <Text style={styles.positionLabel}>Unrealized PNL</Text>
        <Text style={styles.pnlText}>+127.32 USDT / 398.23%</Text>
      </View>
      <View style={styles.positionRow}>
        <Text style={styles.positionLabel}>Size</Text>
        <Text style={styles.positionValue}>0.034 BTC / $3195.34</Text>
      </View>
      <View style={styles.positionRow}>
        <Text style={styles.positionLabel}>Margin(Cross)</Text>
        <Text style={styles.positionValue}>$34.23 USDT</Text>
      </View>
      <View style={styles.positionRow}>
        <Text style={styles.positionLabel}>Entry Price</Text>
        <Text style={styles.positionValue}>90,721.92</Text>
      </View>
      <View style={styles.positionRow}>
        <Text style={styles.positionLabel}>Liq. Price</Text>
        <Text style={styles.positionValue}>80,721.92</Text>
      </View>

      <TouchableOpacity style={styles.cancelButton}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050816',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#101b33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  pairContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff9f1c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  coinIconSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff9f1c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  coinIconText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  pairText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  priceSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  priceText: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '700',
  },
  priceChangeText: {
    marginTop: 4,
    color: '#00c853',
    fontSize: 14,
    fontWeight: '600',
  },
  chartContainer: {
    height: 160,
    backgroundColor: '#071124',
    borderRadius: 24,
    marginBottom: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  chart: {
    borderRadius: 24,
  },
  chartDot: {
    position: 'absolute',
    right: 18,
    top: 20,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00ff6a',
    shadowColor: '#00ff6a',
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },
  segmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#071124',
    borderRadius: 20,
    padding: 4,
    marginBottom: 24,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  segmentItemActive: {
    backgroundColor: '#101b33',
  },
  segmentText: {
    color: '#6f7e9c',
    fontSize: 12,
    fontWeight: '500',
  },
  segmentTextActive: {
    color: '#ffffff',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buySellContainer: {
    flexDirection: 'row',
    backgroundColor: '#071124',
    borderRadius: 20,
    padding: 4,
  },
  buyButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  buyButtonActive: {
    backgroundColor: '#ffb300',
  },
  sellButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  sellButtonActive: {
    backgroundColor: '#ffb300',
  },
  buySellTextActive: {
    color: '#050816',
    fontWeight: '700',
  },
  buySellText: {
    color: '#6f7e9c',
    fontWeight: '600',
  },
  leverageButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: '#071124',
  },
  leverageText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  marketRow: {
    marginTop: 16,
    marginBottom: 16,
  },
  marketActive: {
    color: '#00ff6a',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 16,
  },
  marketInactive: {
    color: '#6f7e9c',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 16,
  },
  limitActive: {
    color: '#00ff6a',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 16,
  },
  limitInactive: {
    color: '#6f7e9c',
    fontSize: 14,
    fontWeight: '600',
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    color: '#a39bc5',
    fontSize: 12,
    marginRight: 4,
  },
  balanceValue: {
    color: '#e573ff',
    fontSize: 12,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#1b2944',
    paddingHorizontal: 20,
    // paddingVertical: 14,
    marginBottom: 16,
  },
  inputPlaceholder: {
    color: '#6f7e9c',
    fontSize: 14,
    width: '80%',
  },
  inputSuffix: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    // paddingHorizontal: 8,
    backgroundColor: '#071124',
  },
  sliderDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffb300',
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tabActive: {
    color: '#ffffff',
    fontWeight: '700',
    marginRight: 16,
  },
  tabInactive: {
    color: '#6f7e9c',
    fontWeight: '600',
    marginRight: 16,
  },
  positionCard: {
    backgroundColor: '#071124',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  positionPairText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  positionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  longText: {
    color: '#00ff6a',
    fontWeight: '700',
    marginRight: 4,
  },
  metaDivider: {
    color: '#6f7e9c',
    marginHorizontal: 2,
  },
  metaText: {
    color: '#6f7e9c',
    fontWeight: '600',
  },
  positionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  positionLabel: {
    color: '#6f7e9c',
    fontSize: 12,
  },
  positionValue: {
    color: '#ffffff',
    fontSize: 12,
  },
  pnlText: {
    color: '#00ff6a',
    fontSize: 12,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 16,
    backgroundColor: '#ffb300',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#050816',
    fontWeight: '700',
  },
});

export default App;

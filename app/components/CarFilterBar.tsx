import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  IconButton,
  Button,
  useDisclosure,
  Collapse,
  VStack,
  Select,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { SearchIcon, AddIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { updateFilters, resetAndFilterCars } from "../redux/slices/filterSlice";
import { fetchCars, filterCars } from "../redux/slices/carSlice"; // Import filterCars
import SubmitCar from "./SubmitCar";

const CarFilterBar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [priceFilterType, setPriceFilterType] = useState<'greater' | 'less' | null>(null);
  const [priceValue, setPriceValue] = useState<number | null>(null);
  const [conditionFilter, setConditionFilter] = useState<'New' | 'Used' | 'Classic' | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

  const filterState = useSelector((state: RootState) => state.filters);
  const isLoading = filterState === undefined;

  // Effect to handle filter updates
  useEffect(() => {
    const filters = {
      searchTerm,
      priceFilter: priceValue !== null && priceFilterType
        ? { operator: priceFilterType, value: priceValue }
        : undefined,
      conditionFilter,
    };

    dispatch(updateFilters(filters));
  }, [searchTerm, priceFilterType, priceValue, conditionFilter, dispatch]);

  // New useEffect to call filterCars when filterState changes
  useEffect(() => {
    // Dispatch filterCars with the current filter state
    dispatch(filterCars({filters: filterState}));
  }, [filterState, dispatch]); // Dependencies array includes filterState

  const handleFetchCars = async () => {
    await dispatch(fetchCars({}));
  };

  const handleSearch = () => {
    handleFetchCars();
    setSearchTerm("");
  };

  const handleClearFilters = () => {
    dispatch(resetAndFilterCars());
    setSearchTerm("");
    setPriceFilterType(null);
    setPriceValue(null);
    setConditionFilter(null);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4} width="100%">
      <Box display="flex" alignItems="center" width="100%" maxWidth="600px" justifyContent="center">
        <Input
          placeholder="Search cars..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          width="150px"
          mr={2}
        />
        <IconButton aria-label="Search Cars" icon={<SearchIcon />} onClick={handleSearch} size="sm" />
        <IconButton aria-label="Add Car" icon={<AddIcon />} onClick={onOpen} ml={2} size="sm" />
        <IconButton
          aria-label="Filters"
          icon={isFiltersOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          ml={2}
          size="sm"
        />
      </Box>

      <Collapse in={isFiltersOpen}>
        <Box mt={2} p={4} borderWidth={1} borderRadius="md" borderColor="gray.200" width="100%" maxWidth="600px">
          <VStack spacing={4}>
            <Text fontWeight="bold">Filters</Text>
            <Select
              placeholder="Select condition"
              value={conditionFilter ?? undefined}
              onChange={(e) => setConditionFilter(e.target.value as 'New' | 'Used' | 'Classic')}
            >
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Classic">Classic</option>
            </Select>
            <Box display="flex" alignItems="center" width="100%">
              <Select
                placeholder="Select price filter type"
                value={priceFilterType ?? undefined}
                onChange={(e) => setPriceFilterType(e.target.value as 'greater' | 'less')}
                mr={2}
              >
                <option value="greater">Greater than</option>
                <option value="less">Less than</option>
              </Select>
              <Input
                placeholder="Price"
                value={priceValue === null ? "" : priceValue}
                onChange={(e) => setPriceValue(e.target.value ? Number(e.target.value) : null)}
                type="number"
                min="0"
              />
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Button onClick={handleFetchCars} colorScheme="teal">
                Fetch Cars
              </Button>
              <Button onClick={handleClearFilters} colorScheme="red">
                Clear Filters
              </Button>
            </Box>
          </VStack>
        </Box>
      </Collapse>

      {/* SubmitCar component in modal */}
      <SubmitCar isOpen={isOpen} onClose={onClose} onSubmit={handleFetchCars} />
    </Box>
  );
};

export default CarFilterBar;

class CountTags {
	public static void main(String[] args) {
		//tagCount(allTags, tags);
	}
	
	public void tagCount(ArrayList<ArrayList<String>> allTags, ArrayList<String> tags) {
		int count = 0;
		for (ArrayList<String> currImageTags: allTags) {
			for (String tag: currImageTags) {
				for (String origTag: tags) {
					if (tag.equalsIgnoreCase(origTag)) {
						count++;
					}
				}
			}
		}
		return count;
	}
}
